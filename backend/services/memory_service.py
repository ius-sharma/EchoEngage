"""
EchoEngage - Memory Service
Handles Hindsight memory operations with fallback to local JSON.
Each follower gets their own Hindsight memory bank.
"""

import os
import json
import logging
from pathlib import Path
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# Local fallback storage
LOCAL_MEMORY_PATH = Path(__file__).parent.parent / "data" / "local_memory.json"


class MemoryService:
    """
    Manages follower memory via Hindsight Cloud.
    Falls back to local JSON storage if Hindsight is unavailable.
    """

    def __init__(self):
        self.hindsight_client = None
        self.use_hindsight = False
        self.local_memory: dict = {}
        self._init_hindsight()
        self._load_local_memory()

    def _init_hindsight(self):
        """Try to initialize Hindsight client."""
        api_url = os.getenv("HINDSIGHT_API_URL", "")
        api_key = os.getenv("HINDSIGHT_API_KEY", "")

        if api_url and api_key and api_key != "your_hindsight_api_key_here":
            try:
                from hindsight_client import Hindsight
                self.hindsight_client = Hindsight(
                    base_url=api_url,
                    api_key=api_key,
                    timeout=15.0
                )
                self.use_hindsight = True
                logger.info("✅ Hindsight Cloud connected successfully")
            except Exception as e:
                logger.warning(f"⚠️ Could not connect to Hindsight: {e}. Using local memory.")
                self.use_hindsight = False
        else:
            logger.info("ℹ️ No Hindsight API key configured. Using local memory fallback.")
            self.use_hindsight = False

    def _load_local_memory(self):
        """Load local memory fallback from JSON file."""
        if LOCAL_MEMORY_PATH.exists():
            try:
                with open(LOCAL_MEMORY_PATH, "r") as f:
                    self.local_memory = json.load(f)
            except Exception:
                self.local_memory = {}
        else:
            self.local_memory = {}

    def _save_local_memory(self):
        """Save local memory to JSON file."""
        LOCAL_MEMORY_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(LOCAL_MEMORY_PATH, "w") as f:
            json.dump(self.local_memory, f, indent=2, default=str)

    def _get_bank_id(self, follower_id: str) -> str:
        """Generate Hindsight bank ID for a follower."""
        return f"echoeng-{follower_id}"

    async def retain(self, follower_id: str, content: str, context: str = ""):
        """Store a memory for a follower."""
        bank_id = self._get_bank_id(follower_id)

        if self.use_hindsight and self.hindsight_client:
            try:
                await self.hindsight_client.aretain(
                    bank_id=bank_id,
                    content=content,
                    context=context or "follower interaction",
                    metadata={"follower_id": follower_id, "source": "echoeng"}
                )
                logger.info(f"📝 Retained memory for {follower_id} in Hindsight")
                return True
            except Exception as e:
                logger.warning(f"Hindsight retain failed: {e}. Falling back to local.")

        # Local fallback
        if bank_id not in self.local_memory:
            self.local_memory[bank_id] = []
        self.local_memory[bank_id].append({
            "content": content,
            "context": context,
            "timestamp": datetime.now().isoformat()
        })
        self._save_local_memory()
        logger.info(f"📝 Retained memory for {follower_id} locally")
        return True

    async def recall(self, follower_id: str, query: str, max_results: int = 10) -> str:
        """Recall memories about a follower relevant to a query."""
        bank_id = self._get_bank_id(follower_id)

        if self.use_hindsight and self.hindsight_client:
            try:
                results = await self.hindsight_client.arecall(
                    bank_id=bank_id,
                    query=query,
                    budget="mid",
                    max_tokens=2048
                )
                if results and results.results:
                    memories = [r.text for r in results.results[:max_results]]
                    memory_text = "\n".join(f"- {m}" for m in memories)
                    logger.info(f"🔍 Recalled {len(memories)} memories for {follower_id}")
                    return memory_text
                return "No previous memories found for this follower."
            except Exception as e:
                logger.warning(f"Hindsight recall failed: {e}. Falling back to local.")

        # Local fallback
        if bank_id in self.local_memory:
            memories = self.local_memory[bank_id]
            memory_texts = [m["content"] for m in memories]
            if memory_texts:
                return "\n".join(f"- {m}" for m in memory_texts[-max_results:])
        return "No previous memories found for this follower."

    async def seed_memories(self, follower_id: str, memories: list[str]):
        """Seed initial memories for a follower (for demo data)."""
        bank_id = self._get_bank_id(follower_id)

        for memory in memories:
            if self.use_hindsight and self.hindsight_client:
                try:
                    await self.hindsight_client.aretain(
                        bank_id=bank_id,
                        content=memory,
                        context="seed data - historical interaction",
                        metadata={"follower_id": follower_id, "source": "seed"}
                    )
                except Exception as e:
                    logger.warning(f"Hindsight seed failed for {follower_id}: {e}")
                    # Fallback to local
                    if bank_id not in self.local_memory:
                        self.local_memory[bank_id] = []
                    self.local_memory[bank_id].append({
                        "content": memory,
                        "context": "seed data",
                        "timestamp": datetime.now().isoformat()
                    })
            else:
                if bank_id not in self.local_memory:
                    self.local_memory[bank_id] = []
                self.local_memory[bank_id].append({
                    "content": memory,
                    "context": "seed data",
                    "timestamp": datetime.now().isoformat()
                })

        if not self.use_hindsight:
            self._save_local_memory()

        logger.info(f"🌱 Seeded {len(memories)} memories for {follower_id}")

    async def create_bank(self, follower_id: str, follower_name: str):
        """Create a Hindsight memory bank for a follower."""
        if not self.use_hindsight or not self.hindsight_client:
            return

        bank_id = self._get_bank_id(follower_id)
        try:
            self.hindsight_client.create_bank(
                bank_id=bank_id,
                name=f"EchoEngage - {follower_name}",
                mission=f"Track relationship memory for follower {follower_name}. "
                        f"Remember their interests, past questions, sentiment, "
                        f"and interaction history to enable personalized responses."
            )
            logger.info(f"🏦 Created bank for {follower_name}")
        except Exception as e:
            # Bank may already exist
            logger.debug(f"Bank creation note for {follower_id}: {e}")

    def get_memory_stats(self) -> dict:
        """Get memory statistics for analytics."""
        if self.use_hindsight:
            return {
                "provider": "Hindsight Cloud",
                "status": "connected",
                "banks_count": "dynamic"
            }
        else:
            return {
                "provider": "Local JSON",
                "status": "fallback",
                "banks_count": len(self.local_memory),
                "total_memories": sum(len(v) for v in self.local_memory.values())
            }


# Singleton instance
memory_service = MemoryService()
