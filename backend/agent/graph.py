"""
EchoEngage - LangGraph Agent Graph
The core 6-node pipeline: recall → classify → route → generate → quality_gate → retain
Uses Groq exclusively for LLM inference.
"""

import os
import json
import logging
import time
from typing import Optional

from langgraph.graph import StateGraph, START, END
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

from agent.state import AgentState, RoutingDecision, CommentClassification
from agent.prompts import SYSTEM_PROMPT, CLASSIFY_PROMPT, REPLY_PROMPT, QUALITY_GATE_PROMPT
from services.memory_service import memory_service
from services.routing_service import routing_service
from data.synthetic_data import CREATOR_PROFILE, get_follower_by_id

logger = logging.getLogger(__name__)


def _get_llm(model: str = "qwen/qwen3-32b", temperature: float = 0.7):
    """Create a Groq LLM instance."""
    groq_key = os.getenv("GROQ_API_KEY", "")
    if not groq_key or groq_key == "your_groq_api_key_here":
        raise ValueError(
            "GROQ_API_KEY is missing or invalid. "
            "Please add a valid Groq API key to your backend/.env file.\n"
            "  Get one free at: https://console.groq.com/keys"
        )

    llm = ChatGroq(
        model=model,
        api_key=groq_key,
        temperature=temperature,
        max_tokens=1024
    )
    logger.info(f"🟢 Using Groq with model: {model}")
    return llm


def _parse_json(text: str) -> dict:
    """Robustly parse JSON from LLM output, handling various formats."""
    import re
    
    if not text:
        return {}
    
    text = text.strip()
    
    # Remove markdown code blocks (handle various formats)
    code_block_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?\s*```', text, re.DOTALL)
    if code_block_match:
        text = code_block_match.group(1).strip()
    elif text.startswith("```json"):
        text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    elif text.startswith("```"):
        text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

    # Handle potential thinking tags from qwen3
    if "<think>" in text:
        think_end = text.find("</think>")
        if think_end != -1:
            text = text[think_end + 8:].strip()
            # Re-strip code blocks after thinking
            code_block_match = re.search(r'```(?:json)?\s*\n?(.*?)\n?\s*```', text, re.DOTALL)
            if code_block_match:
                text = code_block_match.group(1).strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fix common JSON issues: trailing commas before } or ]
    def fix_json(s):
        # Remove trailing commas before closing braces/brackets
        s = re.sub(r',\s*([}\]])', r'\1', s)
        # Remove any control characters
        s = re.sub(r'[\x00-\x1f\x7f]', ' ', s)
        return s

    # Try to find and extract JSON object from the text
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        json_str = text[start:end]
        # Try as-is first
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
        # Try with fixes
        try:
            return json.loads(fix_json(json_str))
        except json.JSONDecodeError:
            pass

    # Last resort: try fixing the entire text
    try:
        return json.loads(fix_json(text))
    except json.JSONDecodeError:
        pass

    logger.error(f"Failed to parse JSON: {text[:300]}")
    return {}


# ─── Node 1: Recall Memory ────────────────────────────────────────
async def recall_memory_node(state: AgentState) -> dict:
    """Fetch follower memory from Hindsight."""
    follower_id = state["follower_id"]
    comment_text = state["comment_text"]

    try:
        memory_context = await memory_service.recall(
            follower_id=follower_id,
            query=comment_text
        )
    except Exception as e:
        logger.error(f"Memory recall error: {e}")
        memory_context = "No previous memories found for this follower."

    logger.info(f"🔍 Memory recalled for {follower_id}: {memory_context[:100]}...")
    return {"memory_context": memory_context}


# ─── Node 2: Classify Comment ─────────────────────────────────────
async def classify_comment_node(state: AgentState) -> dict:
    """Classify the comment's intent, complexity, and priority."""
    follower = get_follower_by_id(state["follower_id"])
    follower_handle = follower["handle"] if follower else "unknown"

    prompt = CLASSIFY_PROMPT.format(
        creator_name=CREATOR_PROFILE["name"],
        creator_niche=CREATOR_PROFILE["niche"],
        follower_name=state["follower_name"],
        follower_handle=follower_handle,
        platform=state["platform"],
        comment_text=state["comment_text"],
        post_context=state.get("post_context", "general post"),
        memory_context=state.get("memory_context", "No memories available")
    )

    try:
        llm = _get_llm(model="qwen/qwen3-32b", temperature=0.3)
        response = await llm.ainvoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt)
        ])
        result = _parse_json(response.content)

        classification = CommentClassification(
            intent=result.get("intent", "appreciation"),
            complexity=result.get("complexity", "simple"),
            sentiment=result.get("sentiment", "neutral"),
            priority_label=result.get("priority_label", "Low Priority"),
            confidence=result.get("confidence", 0.5)
        )
    except Exception as e:
        logger.error(f"Classification error: {e}")
        classification = CommentClassification(
            intent="appreciation", complexity="simple",
            sentiment="neutral", priority_label="Low Priority", confidence=0.3
        )

    logger.info(f"📋 Classified: {classification.get('intent')} | {classification.get('complexity')} | {classification.get('priority_label')}")
    return {"classification": classification}


# ─── Node 3: Route Model ──────────────────────────────────────────
async def route_model_node(state: AgentState) -> dict:
    """Use CascadeFlow-aware routing to select the right model."""
    classification = state.get("classification", {})
    complexity = classification.get("complexity", "simple")
    intent = classification.get("intent", "appreciation")
    has_memory = state.get("memory_context", "") != "No previous memories found for this follower."

    decision = routing_service.route_model(
        complexity=complexity,
        intent=intent,
        has_memory=has_memory
    )

    logger.info(f"🔀 Route decision: {decision['model']} | Savings: {decision['savings_percentage']}%")
    return {
        "routing_decision": decision,
        "selected_model": decision["model"]
    }


# ─── Node 4: Generate Reply ───────────────────────────────────────
async def generate_reply_node(state: AgentState) -> dict:
    """Generate a personalized reply using the selected model."""
    classification = state.get("classification", {})
    selected_model = state.get("selected_model", "qwen/qwen3-32b")

    prompt = REPLY_PROMPT.format(
        creator_name=CREATOR_PROFILE["name"],
        creator_niche=CREATOR_PROFILE["niche"],
        follower_name=state["follower_name"],
        platform=state["platform"],
        comment_text=state["comment_text"],
        post_context=state.get("post_context", "general post"),
        memory_context=state.get("memory_context", "No memories available"),
        intent=classification.get("intent", "unknown"),
        complexity=classification.get("complexity", "simple"),
        priority_label=classification.get("priority_label", "Low Priority")
    )

    try:
        llm = _get_llm(model=selected_model, temperature=0.7)
        start_time = time.time()
        response = await llm.ainvoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt)
        ])
        latency = (time.time() - start_time) * 1000

        result = _parse_json(response.content)

        # Update routing decision with actual latency
        routing_decision = state.get("routing_decision", {})
        if routing_decision:
            routing_decision["latency_ms"] = round(latency, 2)

        return {
            "suggested_reply": result.get("suggested_reply", "Thanks for your comment!"),
            "explanation": result.get("explanation", "Generated a standard reply."),
            "memory_updates": result.get("memory_updates", []),
            "priority_label": classification.get("priority_label", "Low Priority"),
            "routing_decision": routing_decision
        }
    except Exception as e:
        logger.error(f"Reply generation error: {e}")
        return {
            "suggested_reply": f"Thanks for reaching out, {state['follower_name']}! I appreciate your comment.",
            "explanation": f"Fallback reply due to generation error: {type(e).__name__}",
            "memory_updates": [],
            "priority_label": classification.get("priority_label", "Low Priority")
        }


# ─── Node 5: Quality Gate ─────────────────────────────────────────
async def quality_gate_node(state: AgentState) -> dict:
    """Evaluate reply quality. If it fails, mark for escalation."""
    reply = state.get("suggested_reply", "")
    has_memory = state.get("memory_context", "") != "No previous memories found for this follower."

    prompt = QUALITY_GATE_PROMPT.format(
        comment_text=state["comment_text"],
        follower_name=state["follower_name"],
        has_memory="Yes" if has_memory else "No",
        reply=reply
    )

    try:
        llm = _get_llm(model="qwen/qwen3-32b", temperature=0.2)
        response = await llm.ainvoke([
            SystemMessage(content="You are a reply quality evaluator. Return JSON only."),
            HumanMessage(content=prompt)
        ])
        result = _parse_json(response.content)

        passed = result.get("passed", True)
        reason = result.get("reason", "Quality check passed.")
        quality_score = result.get("quality_score", 0.7)

        # Update routing decision
        routing_decision = state.get("routing_decision", {})
        if routing_decision:
            routing_decision["quality_gate_passed"] = passed

        escalation_count = state.get("escalation_count", 0) or 0

        if not passed and escalation_count < 1:
            # Escalate to stronger model
            logger.info(f"⚠️ Quality gate FAILED: {reason}. Escalating...")
            routing_decision = routing_service.escalate(routing_decision)
            return {
                "quality_passed": False,
                "quality_reason": reason,
                "escalation_count": escalation_count + 1,
                "routing_decision": routing_decision,
                "selected_model": routing_decision["model"]
            }

        return {
            "quality_passed": True,
            "quality_reason": reason,
            "routing_decision": routing_decision
        }
    except Exception as e:
        logger.error(f"Quality gate error: {e}")
        return {
            "quality_passed": True,
            "quality_reason": "Quality gate skipped due to error."
        }


# ─── Node 6: Retain Memory ────────────────────────────────────────
async def retain_memory_node(state: AgentState) -> dict:
    """Store new memory facts learned from this interaction."""
    follower_id = state["follower_id"]
    memory_updates = state.get("memory_updates", [])
    comment_text = state["comment_text"]

    # Always retain the interaction itself
    interaction_memory = (
        f"{state['follower_name']} commented: \"{comment_text[:100]}\" "
        f"on {state.get('post_context', 'a post')}. "
        f"Intent: {state.get('classification', {}).get('intent', 'unknown')}. "
        f"Sentiment: {state.get('classification', {}).get('sentiment', 'neutral')}."
    )

    try:
        await memory_service.retain(
            follower_id=follower_id,
            content=interaction_memory,
            context="comment interaction"
        )

        # Retain additional memory facts
        for update in (memory_updates or []):
            if update and len(update.strip()) > 5:
                await memory_service.retain(
                    follower_id=follower_id,
                    content=update,
                    context="learned preference"
                )

        logger.info(f"💾 Retained {1 + len(memory_updates or [])} memories for {follower_id}")
    except Exception as e:
        logger.error(f"Memory retain error: {e}")

    return {}


# ─── Conditional Edge: Quality Gate Check ──────────────────────────
def should_regenerate(state: AgentState) -> str:
    """Decide whether to regenerate reply after quality gate."""
    if not state.get("quality_passed", True) and (state.get("escalation_count", 0) or 0) <= 1:
        return "regenerate"
    return "retain"


# ─── Build the Graph ──────────────────────────────────────────────
def build_agent_graph() -> StateGraph:
    """Build and compile the EchoEngage LangGraph agent."""
    builder = StateGraph(AgentState)

    # Add nodes
    builder.add_node("recall_memory", recall_memory_node)
    builder.add_node("classify_comment", classify_comment_node)
    builder.add_node("route_model", route_model_node)
    builder.add_node("generate_reply", generate_reply_node)
    builder.add_node("quality_gate", quality_gate_node)
    builder.add_node("retain_memory", retain_memory_node)

    # Add edges
    builder.add_edge(START, "recall_memory")
    builder.add_edge("recall_memory", "classify_comment")
    builder.add_edge("classify_comment", "route_model")
    builder.add_edge("route_model", "generate_reply")
    builder.add_edge("generate_reply", "quality_gate")

    # Conditional edge: quality gate can loop back to generate
    builder.add_conditional_edges(
        "quality_gate",
        should_regenerate,
        {
            "regenerate": "generate_reply",
            "retain": "retain_memory"
        }
    )

    builder.add_edge("retain_memory", END)

    # Compile
    graph = builder.compile()
    logger.info("✅ EchoEngage LangGraph agent compiled successfully")
    return graph


# Singleton compiled graph
agent_graph = None


def get_agent_graph():
    """Get or create the compiled agent graph."""
    global agent_graph
    if agent_graph is None:
        agent_graph = build_agent_graph()
    return agent_graph
