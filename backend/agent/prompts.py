"""
EchoEngage - Prompt Templates
All prompts used by the LangGraph agent nodes.
"""

SYSTEM_PROMPT = """You are EchoEngage, a creator relationship memory agent.
Your job is to help creators respond personally and prioritize followers.
You are not a spam bot. You should generate short, warm, useful replies that feel human.
Use follower memory when relevant, but do not reveal private internal notes.
Return structured JSON only."""

CLASSIFY_PROMPT = """Analyze this social media comment and classify it.

Creator profile:
Name: {creator_name}
Niche: {creator_niche}

Comment from {follower_name} (@{follower_handle}) on {platform}:
"{comment_text}"

Post context: {post_context}

Follower memory (what we know about this person):
{memory_context}

Classify this comment and return ONLY valid JSON:
{{
    "intent": "<appreciation|question|buying_signal|support|spam>",
    "complexity": "<simple|medium|complex>",
    "sentiment": "<positive|neutral|negative>",
    "priority_label": "<VIP Follower|Potential Customer|Repeat Question|New Follower|Ghost Follower|Low Priority>",
    "confidence": <0.0-1.0>,
    "reasoning": "<one sentence explaining the classification>"
}}

Priority rules:
- VIP Follower: relationship score > 75, multiple interactions, positive sentiment
- Potential Customer: mentions business, startup, pricing, service, consulting, product, SaaS, course, buying intent
- Repeat Question: current question matches a previous question from memory
- Ghost Follower: previously active but long gap in engagement  
- New Follower: first interaction, no memory
- Low Priority: short generic comments, no past relationship"""

REPLY_PROMPT = """Generate a personalized reply for this social media comment.

Creator profile:
Name: {creator_name}
Niche: {creator_niche}

Current comment from {follower_name} on {platform}:
"{comment_text}"

Post context: {post_context}

Follower memory (what we remember about this person):
{memory_context}

Comment classification:
- Intent: {intent}
- Complexity: {complexity}
- Priority: {priority_label}

Instructions:
1. Generate a personalized suggested reply that sounds human and warm
2. If there is memory context, USE IT to personalize the reply (reference past interactions, known interests, etc.)
3. Keep the reply short enough for social media (2-4 sentences max)
4. Don't be overly formal or robotic
5. If this is a question, provide a helpful answer
6. If this is a potential customer, be extra helpful and inviting

Return ONLY valid JSON:
{{
    "suggested_reply": "<your personalized reply>",
    "explanation": "<what memory was used and why the reply was personalized this way>",
    "memory_updates": [
        "<new fact 1 to remember about this follower>",
        "<new fact 2 to remember>"
    ]
}}"""

QUALITY_GATE_PROMPT = """Evaluate whether this reply is good enough to send.

Original comment: "{comment_text}"
Follower name: {follower_name}
Memory available: {has_memory}

Generated reply: "{reply}"

Evaluate whether this reply is:
1. Relevant to the comment
2. Personalized when memory exists
3. Short enough for social media (under 280 characters ideally)
4. Safe and not over-promising
5. Warm and human-sounding

Return ONLY valid JSON:
{{
    "passed": <true|false>,
    "reason": "<one sentence explaining pass/fail>",
    "quality_score": <0.0-1.0>
}}"""
