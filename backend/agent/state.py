"""
EchoEngage - LangGraph Agent State Definition
Defines the shared state that flows through all graph nodes.
"""

from typing import Optional, Literal
from typing_extensions import TypedDict, Annotated
from langgraph.graph import MessagesState


class RoutingDecision(TypedDict, total=False):
    """CascadeFlow routing decision metadata."""
    model: str
    reason: str
    complexity_score: float
    quality_gate_passed: bool
    escalated: bool
    estimated_cost: float
    latency_ms: float
    drafter_model: Optional[str]
    verifier_model: Optional[str]
    savings_percentage: float


class CommentClassification(TypedDict, total=False):
    """Classification of a comment's intent and complexity."""
    intent: str  # appreciation, question, buying_signal, support, spam
    complexity: str  # simple, medium, complex
    sentiment: str  # positive, neutral, negative
    priority_label: str  # VIP Follower, Potential Customer, Repeat Question, New Follower, Ghost Follower, Low Priority
    confidence: float


class AgentState(MessagesState):
    """
    Full state flowing through the EchoEngage LangGraph pipeline.
    Extends MessagesState to include custom fields for memory, routing, etc.
    """
    # Input
    comment_id: str
    comment_text: str
    follower_id: str
    follower_name: str
    platform: str
    post_context: str

    # Memory (populated by recall node)
    memory_context: Optional[str]

    # Classification (populated by classify node)
    classification: Optional[CommentClassification]

    # Routing (populated by route node)
    routing_decision: Optional[RoutingDecision]
    selected_model: Optional[str]

    # Reply (populated by generate node)
    suggested_reply: Optional[str]
    explanation: Optional[str]
    memory_updates: Optional[list[str]]
    priority_label: Optional[str]

    # Quality gate
    quality_passed: Optional[bool]
    quality_reason: Optional[str]
    escalation_count: Optional[int]
