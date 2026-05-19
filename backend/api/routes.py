"""
EchoEngage - FastAPI Routes
REST API endpoints for the frontend dashboard.
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from agent.graph import get_agent_graph
from services.memory_service import memory_service
from services.routing_service import routing_service
from data.synthetic_data import (
    COMMENTS, FOLLOWERS, CREATOR_PROFILE,
    get_follower_by_id, get_comments_for_follower, SEED_MEMORIES
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")

# Track processed comments
processed_comments: dict = {}


class ProcessRequest(BaseModel):
    """Request to process a comment through the agent."""
    comment_id: str


class ApproveRequest(BaseModel):
    """Request to approve a suggested reply."""
    comment_id: str


# ─── Comments ──────────────────────────────────────────────────────

@router.get("/comments")
async def get_comments():
    """Get all comments in the inbox."""
    comments_with_status = []
    for c in COMMENTS:
        comment = {**c}
        if c["id"] in processed_comments:
            comment["status"] = "processed"
            comment["agent_response"] = processed_comments[c["id"]]
        comments_with_status.append(comment)
    return {"comments": comments_with_status, "total": len(COMMENTS)}


@router.get("/comments/{comment_id}")
async def get_comment(comment_id: str):
    """Get a specific comment with its processing result."""
    for c in COMMENTS:
        if c["id"] == comment_id:
            comment = {**c}
            if comment_id in processed_comments:
                comment["status"] = "processed"
                comment["agent_response"] = processed_comments[comment_id]
            return comment
    raise HTTPException(status_code=404, detail="Comment not found")


# ─── Followers ─────────────────────────────────────────────────────

@router.get("/followers")
async def get_followers():
    """Get all followers with their profiles."""
    return {"followers": FOLLOWERS, "total": len(FOLLOWERS)}


@router.get("/followers/{follower_id}")
async def get_follower(follower_id: str):
    """Get a specific follower's profile and interaction history."""
    follower = get_follower_by_id(follower_id)
    if not follower:
        raise HTTPException(status_code=404, detail="Follower not found")

    # Get their comments
    comments = get_comments_for_follower(follower_id)

    # Get their memory
    try:
        memory = await memory_service.recall(
            follower_id=follower_id,
            query=f"Everything about {follower['name']}"
        )
    except Exception:
        memory = "Memory unavailable"

    return {
        "follower": follower,
        "comments": comments,
        "memory": memory
    }


# ─── Process Comment (Main Agent Flow) ────────────────────────────

@router.post("/process")
async def process_comment(request: ProcessRequest):
    """
    Process a comment through the full LangGraph agent pipeline.
    This is the core endpoint that triggers:
    recall → classify → route → generate → quality_gate → retain
    """
    # Find the comment
    comment = None
    for c in COMMENTS:
        if c["id"] == request.comment_id:
            comment = c
            break

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Check if already processed
    if request.comment_id in processed_comments:
        return {
            "status": "already_processed",
            "result": processed_comments[request.comment_id]
        }

    # Get the follower
    follower = get_follower_by_id(comment["follower_id"])
    if not follower:
        raise HTTPException(status_code=404, detail="Follower not found")

    # Build initial state for the LangGraph agent
    initial_state = {
        "messages": [],
        "comment_id": comment["id"],
        "comment_text": comment["message"],
        "follower_id": comment["follower_id"],
        "follower_name": comment["follower_name"],
        "platform": comment["platform"],
        "post_context": comment.get("post_context", "general post"),
        "memory_context": None,
        "classification": None,
        "routing_decision": None,
        "selected_model": None,
        "suggested_reply": None,
        "explanation": None,
        "memory_updates": None,
        "priority_label": None,
        "quality_passed": None,
        "quality_reason": None,
        "escalation_count": 0
    }

    try:
        # Run the LangGraph agent
        graph = get_agent_graph()
        final_state = await graph.ainvoke(initial_state)

        # Build response
        result = {
            "comment_id": comment["id"],
            "follower_id": comment["follower_id"],
            "follower_name": comment["follower_name"],
            "suggested_reply": final_state.get("suggested_reply", ""),
            "priority_label": final_state.get("priority_label", "Low Priority"),
            "explanation": final_state.get("explanation", ""),
            "memory_updates": final_state.get("memory_updates", []),
            "memory_context": final_state.get("memory_context", ""),
            "classification": final_state.get("classification", {}),
            "routing_decision": final_state.get("routing_decision", {}),
            "quality_passed": final_state.get("quality_passed", True),
            "quality_reason": final_state.get("quality_reason", "")
        }

        # Store result
        processed_comments[request.comment_id] = result

        logger.info(f"✅ Processed comment {comment['id']} for {comment['follower_name']}")
        return {"status": "success", "result": result}

    except Exception as e:
        logger.error(f"❌ Error processing comment: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Approve Reply ─────────────────────────────────────────────────

@router.post("/approve")
async def approve_reply(request: ApproveRequest):
    """Mark a reply as approved by the creator."""
    if request.comment_id not in processed_comments:
        raise HTTPException(status_code=404, detail="Comment not processed yet")

    processed_comments[request.comment_id]["approved"] = True

    # Update comment status
    for c in COMMENTS:
        if c["id"] == request.comment_id:
            c["status"] = "replied"
            c["reply"] = processed_comments[request.comment_id]["suggested_reply"]
            break

    return {"status": "approved", "comment_id": request.comment_id}


# ─── Regenerate Reply ──────────────────────────────────────────────

@router.post("/regenerate")
async def regenerate_reply(request: ProcessRequest):
    """
    Re-process a comment through the full LangGraph pipeline.
    Unlike /process, this always runs the pipeline even if already processed.
    """
    # Find the comment
    comment = None
    for c in COMMENTS:
        if c["id"] == request.comment_id:
            comment = c
            break

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    # Get the follower
    follower = get_follower_by_id(comment["follower_id"])
    if not follower:
        raise HTTPException(status_code=404, detail="Follower not found")

    # Build initial state for the LangGraph agent
    initial_state = {
        "messages": [],
        "comment_id": comment["id"],
        "comment_text": comment["message"],
        "follower_id": comment["follower_id"],
        "follower_name": comment["follower_name"],
        "platform": comment["platform"],
        "post_context": comment.get("post_context", "general post"),
        "memory_context": None,
        "classification": None,
        "routing_decision": None,
        "selected_model": None,
        "suggested_reply": None,
        "explanation": None,
        "memory_updates": None,
        "priority_label": None,
        "quality_passed": None,
        "quality_reason": None,
        "escalation_count": 0
    }

    try:
        # Run the LangGraph agent
        graph = get_agent_graph()
        final_state = await graph.ainvoke(initial_state)

        # Build response
        result = {
            "comment_id": comment["id"],
            "follower_id": comment["follower_id"],
            "follower_name": comment["follower_name"],
            "suggested_reply": final_state.get("suggested_reply", ""),
            "priority_label": final_state.get("priority_label", "Low Priority"),
            "explanation": final_state.get("explanation", ""),
            "memory_updates": final_state.get("memory_updates", []),
            "memory_context": final_state.get("memory_context", ""),
            "classification": final_state.get("classification", {}),
            "routing_decision": final_state.get("routing_decision", {}),
            "quality_passed": final_state.get("quality_passed", True),
            "quality_reason": final_state.get("quality_reason", "")
        }

        # Update stored result (overwrite previous)
        processed_comments[request.comment_id] = result

        logger.info(f"🔄 Regenerated reply for comment {comment['id']} for {comment['follower_name']}")
        return {"status": "success", "result": result}

    except Exception as e:
        logger.error(f"❌ Error regenerating reply: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── Analytics ─────────────────────────────────────────────────────

@router.get("/analytics")
async def get_analytics():
    """Get dashboard analytics and metrics."""
    routing_analytics = routing_service.get_analytics()
    memory_stats = memory_service.get_memory_stats()

    # Count priority labels
    priority_counts = {}
    for result in processed_comments.values():
        label = result.get("priority_label", "Unknown")
        priority_counts[label] = priority_counts.get(label, 0) + 1

    return {
        "total_comments": len(COMMENTS),
        "processed_comments": len(processed_comments),
        "pending_comments": len(COMMENTS) - len(processed_comments),
        "approved_replies": sum(1 for r in processed_comments.values() if r.get("approved")),
        "priority_breakdown": priority_counts,
        "routing": routing_analytics,
        "memory": memory_stats,
        "creator": CREATOR_PROFILE
    }


# ─── Creator Profile ──────────────────────────────────────────────

@router.get("/creator")
async def get_creator():
    """Get the creator profile."""
    return CREATOR_PROFILE


# ─── Seed Memories ─────────────────────────────────────────────────

@router.post("/seed-memories")
async def seed_memories():
    """Seed initial memories into Hindsight for demo data."""
    seeded = 0
    for follower_id, memories in SEED_MEMORIES.items():
        follower = get_follower_by_id(follower_id)
        if follower:
            await memory_service.create_bank(follower_id, follower["name"])
            await memory_service.seed_memories(follower_id, memories)
            seeded += len(memories)

    return {
        "status": "success",
        "followers_seeded": len(SEED_MEMORIES),
        "total_memories": seeded
    }


# ─── Health Check ──────────────────────────────────────────────────

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "memory_provider": memory_service.get_memory_stats()["provider"],
        "cascadeflow": routing_service.cascadeflow_enabled
    }
