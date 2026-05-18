"""
EchoEngage - Routing Service
Manages CascadeFlow model routing with cost tracking and audit trail.
"""

import os
import time
import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Model cost estimates (per 1K tokens)
MODEL_COSTS = {
    "qwen/qwen3-32b": {"input": 0.0002, "output": 0.0004},
    "openai/gpt-oss-120b": {"input": 0.005, "output": 0.015},
    "llama-3.3-70b-versatile": {"input": 0.00059, "output": 0.00079},
}

# Strong model used for complex tasks
STRONG_MODEL = "openai/gpt-oss-120b"
# Cheap model used for simple tasks
CHEAP_MODEL = "qwen/qwen3-32b"
# Fallback model
FALLBACK_MODEL = "llama-3.3-70b-versatile"


class RoutingService:
    """
    Manages CascadeFlow model routing decisions with cost tracking.
    Provides audit trail for every routing decision.
    """

    def __init__(self):
        self.cascadeflow_enabled = False
        self.audit_trail: list[dict] = []
        self.total_cost = 0.0
        self.baseline_cost = 0.0
        self._init_cascadeflow()

    def _init_cascadeflow(self):
        """Try to initialize CascadeFlow."""
        try:
            import cascadeflow
            mode = os.getenv("CASCADEFLOW_MODE", "observe")
            cascadeflow.init(mode=mode)
            self.cascadeflow_enabled = True
            logger.info(f"✅ CascadeFlow initialized in {mode} mode")
        except Exception as e:
            logger.warning(f"⚠️ CascadeFlow not available: {e}. Using manual routing.")
            self.cascadeflow_enabled = False

    def route_model(self, complexity: str, intent: str, has_memory: bool) -> dict:
        """
        Determine which model to use based on comment complexity.
        Returns routing decision with model, reason, and cost estimate.
        """
        start_time = time.time()

        if complexity == "simple" and intent == "appreciation":
            model = CHEAP_MODEL
            reason = "Simple appreciation comment — using efficient model"
            complexity_score = 0.2
        elif complexity == "simple":
            model = CHEAP_MODEL
            reason = "Simple comment — using efficient model to save cost"
            complexity_score = 0.3
        elif complexity == "medium":
            model = CHEAP_MODEL
            reason = "Medium complexity — trying efficient model first, will escalate if quality fails"
            complexity_score = 0.5
        elif complexity == "complex":
            model = STRONG_MODEL
            reason = "Complex technical/business question — using strong model for quality"
            complexity_score = 0.8
        else:
            model = CHEAP_MODEL
            reason = "Default routing to efficient model"
            complexity_score = 0.4

        # If buying signal, always use strong model
        if intent == "buying_signal":
            model = STRONG_MODEL
            reason = "Buying signal detected — using strong model for quality response"
            complexity_score = 0.9

        latency = (time.time() - start_time) * 1000  # ms

        # Calculate estimated cost
        estimated_cost = self._estimate_cost(model, complexity_score)
        baseline_cost = self._estimate_cost(STRONG_MODEL, complexity_score)

        decision = {
            "model": model,
            "reason": reason,
            "complexity_score": complexity_score,
            "quality_gate_passed": True,
            "escalated": False,
            "estimated_cost": round(estimated_cost, 6),
            "baseline_cost": round(baseline_cost, 6),
            "latency_ms": round(latency, 2),
            "timestamp": datetime.now().isoformat(),
            "savings_percentage": round(
                max(0, (1 - estimated_cost / baseline_cost) * 100) if baseline_cost > 0 else 0, 1
            )
        }

        # Track costs
        self.total_cost += estimated_cost
        self.baseline_cost += baseline_cost

        # Add to audit trail
        self.audit_trail.append(decision)
        logger.info(f"🔀 Routed to {model} | Reason: {reason} | Cost: ${estimated_cost:.4f}")

        return decision

    def escalate(self, decision: dict) -> dict:
        """Escalate to a stronger model after quality gate failure."""
        decision["model"] = STRONG_MODEL
        decision["escalated"] = True
        decision["reason"] += " [ESCALATED: quality gate failed on cheaper model]"

        # Update cost
        old_cost = decision["estimated_cost"]
        new_cost = self._estimate_cost(STRONG_MODEL, decision["complexity_score"])
        decision["estimated_cost"] = round(new_cost, 6)

        # Update totals
        self.total_cost = self.total_cost - old_cost + new_cost

        # Update audit trail
        if self.audit_trail:
            self.audit_trail[-1] = decision

        logger.info(f"⬆️ Escalated to {STRONG_MODEL}")
        return decision

    def _estimate_cost(self, model: str, complexity_score: float) -> float:
        """Estimate cost based on model and expected token usage."""
        costs = MODEL_COSTS.get(model, MODEL_COSTS[CHEAP_MODEL])
        # Estimate tokens based on complexity
        input_tokens = 500 + int(complexity_score * 1000)
        output_tokens = 100 + int(complexity_score * 400)
        return (input_tokens * costs["input"] + output_tokens * costs["output"]) / 1000

    def get_cascadeflow_callback(self):
        """Get CascadeFlow callback handler for LangChain integration."""
        if not self.cascadeflow_enabled:
            return None
        try:
            from cascadeflow.integrations.langchain import get_harness_callback
            return get_harness_callback()
        except Exception as e:
            logger.warning(f"Could not get CascadeFlow callback: {e}")
            return None

    def get_analytics(self) -> dict:
        """Get routing analytics for dashboard."""
        if not self.audit_trail:
            return {
                "total_requests": 0,
                "total_cost": 0,
                "baseline_cost": 0,
                "savings": 0,
                "savings_percentage": 0,
                "cheap_model_usage": 0,
                "strong_model_usage": 0,
                "escalations": 0,
                "avg_latency_ms": 0,
                "audit_trail": []
            }

        cheap_count = sum(1 for d in self.audit_trail if d["model"] == CHEAP_MODEL)
        strong_count = sum(1 for d in self.audit_trail if d["model"] == STRONG_MODEL)
        escalations = sum(1 for d in self.audit_trail if d.get("escalated", False))
        avg_latency = sum(d["latency_ms"] for d in self.audit_trail) / len(self.audit_trail)
        savings = self.baseline_cost - self.total_cost

        return {
            "total_requests": len(self.audit_trail),
            "total_cost": round(self.total_cost, 4),
            "baseline_cost": round(self.baseline_cost, 4),
            "savings": round(savings, 4),
            "savings_percentage": round(
                (savings / self.baseline_cost * 100) if self.baseline_cost > 0 else 0, 1
            ),
            "cheap_model_usage": cheap_count,
            "strong_model_usage": strong_count,
            "escalations": escalations,
            "avg_latency_ms": round(avg_latency, 2),
            "audit_trail": self.audit_trail[-20:]  # Last 20 decisions
        }


# Singleton instance
routing_service = RoutingService()
