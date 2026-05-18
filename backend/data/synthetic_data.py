"""
EchoEngage - Synthetic Demo Dataset
Realistic follower and comment data for hackathon demo.
"""

from datetime import datetime, timedelta
import random

# ─── Creator Profile ───────────────────────────────────────────────
CREATOR_PROFILE = {
    "name": "Aarav",
    "handle": "@aarav_ai",
    "bio": "AI tools creator | 52k followers | Sharing AI productivity content daily",
    "niche": "AI productivity tools, automation, creator workflows",
    "followers": 52000,
    "content_topics": [
        "AI productivity tools",
        "automation workflows",
        "creator economy",
        "solo entrepreneur tools",
        "prompt engineering",
        "AI agents"
    ]
}

# ─── Followers ─────────────────────────────────────────────────────
FOLLOWERS = [
    {
        "id": "follower_riya",
        "name": "Riya Sharma",
        "handle": "@riya_builds",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Riya",
        "platform": "instagram",
        "relationship_score": 87,
        "interaction_count": 9,
        "last_active_at": (datetime.now() - timedelta(hours=2)).isoformat(),
        "interests": ["AI productivity tools", "automation", "solo creator workflows"],
        "tags": ["vip", "engaged", "repeat_visitor"],
        "notes": [
            "Loves AI tools content",
            "Asked about automation for solo creators",
            "Responds positively to practical tool recommendations",
            "Building a content creation workflow"
        ],
        "sentiment_history": ["positive", "positive", "positive", "neutral", "positive", "positive", "positive", "positive", "positive"]
    },
    {
        "id": "follower_karan",
        "name": "Karan Mehta",
        "handle": "@karan_saas",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Karan",
        "platform": "linkedin",
        "relationship_score": 62,
        "interaction_count": 4,
        "last_active_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "interests": ["AI agents", "SaaS", "business automation", "startup tools"],
        "tags": ["potential_customer", "business"],
        "notes": [
            "Runs a SaaS startup",
            "Interested in AI agents for his business",
            "Mentioned budget for AI tools",
            "Technical background"
        ],
        "sentiment_history": ["neutral", "positive", "positive", "positive"]
    },
    {
        "id": "follower_neha",
        "name": "Neha Verma",
        "handle": "@neha_creates",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Neha",
        "platform": "instagram",
        "relationship_score": 28,
        "interaction_count": 5,
        "last_active_at": (datetime.now() - timedelta(days=45)).isoformat(),
        "interests": ["content creation", "design tools", "Canva"],
        "tags": ["ghost", "previously_active"],
        "notes": [
            "Was very active 2 months ago",
            "Liked design and content creation tools",
            "Stopped engaging after a product recommendation post",
            "May need re-engagement"
        ],
        "sentiment_history": ["positive", "positive", "neutral", "neutral", "negative"]
    },
    {
        "id": "follower_aman",
        "name": "Aman Singh",
        "handle": "@aman_newbie",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Aman",
        "platform": "youtube",
        "relationship_score": 6,
        "interaction_count": 1,
        "last_active_at": datetime.now().isoformat(),
        "interests": [],
        "tags": ["new"],
        "notes": [],
        "sentiment_history": ["positive"]
    },
    {
        "id": "follower_priya",
        "name": "Priya Nair",
        "handle": "@priya_automates",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
        "platform": "instagram",
        "relationship_score": 55,
        "interaction_count": 6,
        "last_active_at": (datetime.now() - timedelta(hours=5)).isoformat(),
        "interests": ["automation", "no-code tools", "Zapier", "Make.com"],
        "tags": ["repeat_question", "engaged"],
        "notes": [
            "Asked about Zapier vs Make.com twice",
            "Interested in no-code automation",
            "Building a small e-commerce workflow",
            "Tends to ask similar questions"
        ],
        "sentiment_history": ["neutral", "positive", "positive", "neutral", "positive", "positive"]
    },
    {
        "id": "follower_arjun",
        "name": "Arjun Patel",
        "handle": "@arjun_dev",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Arjun",
        "platform": "linkedin",
        "relationship_score": 72,
        "interaction_count": 7,
        "last_active_at": (datetime.now() - timedelta(hours=8)).isoformat(),
        "interests": ["AI agents", "LangChain", "Python", "developer tools"],
        "tags": ["vip", "technical", "engaged"],
        "notes": [
            "Software developer interested in AI agents",
            "Uses LangChain and Python",
            "Shares technical feedback on posts",
            "Potential collaborator"
        ],
        "sentiment_history": ["positive", "positive", "positive", "neutral", "positive", "positive", "positive"]
    },
    {
        "id": "follower_meera",
        "name": "Meera Kapoor",
        "handle": "@meera_writes",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Meera",
        "platform": "instagram",
        "relationship_score": 41,
        "interaction_count": 3,
        "last_active_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "interests": ["AI writing tools", "content marketing", "copywriting"],
        "tags": ["engaged"],
        "notes": [
            "Content writer looking for AI writing assistants",
            "Interested in ChatGPT alternatives",
            "Asked about Jasper vs Claude"
        ],
        "sentiment_history": ["positive", "neutral", "positive"]
    },
    {
        "id": "follower_vikram",
        "name": "Vikram Rao",
        "handle": "@vikram_hustle",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram",
        "platform": "youtube",
        "relationship_score": 15,
        "interaction_count": 2,
        "last_active_at": (datetime.now() - timedelta(days=10)).isoformat(),
        "interests": ["side hustles", "passive income"],
        "tags": ["low_priority"],
        "notes": [
            "Generic engagement",
            "No specific topic interest"
        ],
        "sentiment_history": ["neutral", "neutral"]
    },
    {
        "id": "follower_sara",
        "name": "Sara Khan",
        "handle": "@sara_startups",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Sara",
        "platform": "linkedin",
        "relationship_score": 48,
        "interaction_count": 3,
        "last_active_at": (datetime.now() - timedelta(hours=12)).isoformat(),
        "interests": ["startup tools", "AI for business", "productivity"],
        "tags": ["potential_customer"],
        "notes": [
            "Founder of an early-stage startup",
            "Looking for AI tools to reduce team workload",
            "Mentioned considering paid tools"
        ],
        "sentiment_history": ["positive", "positive", "neutral"]
    },
    {
        "id": "follower_dev",
        "name": "Dev Malhotra",
        "handle": "@dev_codes",
        "avatar_url": "https://api.dicebear.com/9.x/avataaars/svg?seed=Dev",
        "platform": "youtube",
        "relationship_score": 33,
        "interaction_count": 2,
        "last_active_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "interests": ["coding", "AI APIs", "open source"],
        "tags": ["technical"],
        "notes": [
            "Asked about open source AI tools",
            "Interested in API integrations"
        ],
        "sentiment_history": ["neutral", "positive"]
    }
]

# ─── Comments (Demo Inbox) ────────────────────────────────────────
COMMENTS = [
    # Riya - VIP, recent, should show memory personalization
    {
        "id": "comment_001",
        "follower_id": "follower_riya",
        "follower_name": "Riya Sharma",
        "follower_handle": "@riya_builds",
        "platform": "instagram",
        "message": "Any tool recommendations for my content creation workflow? I've been struggling with automating my social posts.",
        "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
        "status": "pending",
        "priority": "high",
        "post_context": "AI Tools Carousel Post"
    },
    # Karan - Potential customer, complex question
    {
        "id": "comment_002",
        "follower_id": "follower_karan",
        "follower_name": "Karan Mehta",
        "follower_handle": "@karan_saas",
        "platform": "linkedin",
        "message": "Can you explain how AI agents could help my SaaS startup? We're spending too much time on customer onboarding and support. Looking for something we can actually deploy.",
        "timestamp": (datetime.now() - timedelta(minutes=32)).isoformat(),
        "status": "pending",
        "priority": "high",
        "post_context": "AI Agents for Business Post"
    },
    # Aman - New follower, first interaction
    {
        "id": "comment_003",
        "follower_id": "follower_aman",
        "follower_name": "Aman Singh",
        "follower_handle": "@aman_newbie",
        "platform": "youtube",
        "message": "Just discovered your channel. Great content on AI tools!",
        "timestamp": (datetime.now() - timedelta(minutes=45)).isoformat(),
        "status": "pending",
        "priority": "low",
        "post_context": "AI Productivity Tools Video"
    },
    # Priya - Repeat question
    {
        "id": "comment_004",
        "follower_id": "follower_priya",
        "follower_name": "Priya Nair",
        "follower_handle": "@priya_automates",
        "platform": "instagram",
        "message": "Hey, I'm still confused about Zapier vs Make.com. Which one should I pick for my e-commerce store? I asked before but I'm still not sure.",
        "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
        "status": "pending",
        "priority": "medium",
        "post_context": "No-Code Automation Guide"
    },
    # Arjun - Technical VIP
    {
        "id": "comment_005",
        "follower_id": "follower_arjun",
        "follower_name": "Arjun Patel",
        "follower_handle": "@arjun_dev",
        "platform": "linkedin",
        "message": "Have you tried using LangGraph for building multi-step AI workflows? I'm comparing it with CrewAI for a project. Would love your take on the tradeoffs.",
        "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
        "status": "pending",
        "priority": "high",
        "post_context": "AI Agent Frameworks Post"
    },
    # Generic low-priority
    {
        "id": "comment_006",
        "follower_id": "follower_vikram",
        "follower_name": "Vikram Rao",
        "follower_handle": "@vikram_hustle",
        "platform": "youtube",
        "message": "Nice post 🔥",
        "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
        "status": "pending",
        "priority": "low",
        "post_context": "AI Tools Carousel Post"
    },
    # Sara - potential customer
    {
        "id": "comment_007",
        "follower_id": "follower_sara",
        "follower_name": "Sara Khan",
        "follower_handle": "@sara_startups",
        "platform": "linkedin",
        "message": "We're a 5-person startup and AI tools are becoming essential for us. Do you offer any consulting or personalized tool recommendations? Happy to pay for a session.",
        "timestamp": (datetime.now() - timedelta(hours=4)).isoformat(),
        "status": "pending",
        "priority": "high",
        "post_context": "Startup AI Stack Post"
    },
    # Meera - writing tools
    {
        "id": "comment_008",
        "follower_id": "follower_meera",
        "follower_name": "Meera Kapoor",
        "follower_handle": "@meera_writes",
        "platform": "instagram",
        "message": "Is Claude better than ChatGPT for long-form writing? I need something for blog posts and newsletters.",
        "timestamp": (datetime.now() - timedelta(hours=5)).isoformat(),
        "status": "pending",
        "priority": "medium",
        "post_context": "AI Writing Tools Comparison"
    },
    # Neha - Ghost follower re-appearance
    {
        "id": "comment_009",
        "follower_id": "follower_neha",
        "follower_name": "Neha Verma",
        "follower_handle": "@neha_creates",
        "platform": "instagram",
        "message": "Hey, been a while! Are you still recommending Canva for content creation or have you switched to something else?",
        "timestamp": (datetime.now() - timedelta(hours=6)).isoformat(),
        "status": "pending",
        "priority": "medium",
        "post_context": "Design Tools Update"
    },
    # Dev - technical
    {
        "id": "comment_010",
        "follower_id": "follower_dev",
        "follower_name": "Dev Malhotra",
        "follower_handle": "@dev_codes",
        "platform": "youtube",
        "message": "Do you have a beginner roadmap for getting into AI development? I know Python but never worked with LLM APIs.",
        "timestamp": (datetime.now() - timedelta(hours=7)).isoformat(),
        "status": "pending",
        "priority": "medium",
        "post_context": "AI Developer Roadmap Video"
    },
    # Riya earlier interaction (for memory demo)
    {
        "id": "comment_011",
        "follower_id": "follower_riya",
        "follower_name": "Riya Sharma",
        "follower_handle": "@riya_builds",
        "platform": "instagram",
        "message": "Loved your AI tools carousel! Especially the part about Notion AI.",
        "timestamp": (datetime.now() - timedelta(days=5)).isoformat(),
        "status": "replied",
        "priority": "medium",
        "post_context": "AI Tools Carousel Post",
        "reply": "Thanks Riya, glad you found it helpful! Notion AI is a game changer for organizing content."
    },
    # Another Riya earlier one
    {
        "id": "comment_012",
        "follower_id": "follower_riya",
        "follower_name": "Riya Sharma",
        "follower_handle": "@riya_builds",
        "platform": "instagram",
        "message": "Can you suggest tools for automating content research? I spend hours finding topics.",
        "timestamp": (datetime.now() - timedelta(days=12)).isoformat(),
        "status": "replied",
        "priority": "high",
        "post_context": "Content Research Automation Post",
        "reply": "Riya, try Perplexity for research and Feedly for topic discovery. Both save hours!"
    }
]

# ─── Pre-seeded Memory for Hindsight ──────────────────────────────
# These will be retained into Hindsight banks on startup
SEED_MEMORIES = {
    "follower_riya": [
        "Riya Sharma likes AI productivity tools and automation content.",
        "Riya asked about automating content research for solo creators.",
        "Riya loved the AI tools carousel, especially the Notion AI section.",
        "Riya is building a content creation workflow for her personal brand.",
        "Riya responds positively to practical, tool-specific recommendations.",
        "Riya has been consistently engaged over 9 interactions with positive sentiment.",
        "Riya is interested in solo creator workflows and content automation.",
        "Riya previously asked about tools for topic discovery and research.",
        "Riya was recommended Perplexity for research and Feedly for topic discovery."
    ],
    "follower_karan": [
        "Karan Mehta runs a SaaS startup and is interested in AI agents for business.",
        "Karan has a technical background and understands AI concepts.",
        "Karan mentioned having budget for AI tools.",
        "Karan is looking for AI solutions for customer onboarding and support."
    ],
    "follower_neha": [
        "Neha Verma was very active 2 months ago engaging with design tool content.",
        "Neha liked Canva and content creation tools.",
        "Neha stopped engaging after a product recommendation post.",
        "Neha has been inactive for over 40 days - considered a ghost follower."
    ],
    "follower_priya": [
        "Priya Nair asked about Zapier vs Make.com for e-commerce automation.",
        "Priya is interested in no-code automation tools.",
        "Priya is building a small e-commerce workflow.",
        "Priya has asked about Zapier vs Make.com comparison before - this is a repeated question."
    ],
    "follower_arjun": [
        "Arjun Patel is a software developer interested in AI agent frameworks.",
        "Arjun uses LangChain and Python for AI development.",
        "Arjun provides technical feedback on posts and engages deeply with content.",
        "Arjun could be a potential collaborator on AI projects."
    ],
    "follower_meera": [
        "Meera Kapoor is a content writer looking for AI writing assistants.",
        "Meera asked about Jasper vs Claude for writing.",
        "Meera is interested in tools for blog posts and newsletters."
    ],
    "follower_sara": [
        "Sara Khan is a founder of an early-stage startup with 5 people.",
        "Sara is looking for AI tools to reduce team workload.",
        "Sara mentioned she is willing to pay for personalized tool recommendations."
    ]
}


def get_follower_by_id(follower_id: str):
    """Get a follower by their ID."""
    for f in FOLLOWERS:
        if f["id"] == follower_id:
            return f
    return None


def get_comments_for_follower(follower_id: str):
    """Get all comments from a specific follower."""
    return [c for c in COMMENTS if c["follower_id"] == follower_id]


def calculate_relationship_score(follower: dict) -> int:
    """Calculate relationship score using the formula from the dev plan."""
    interaction_count = follower.get("interaction_count", 0)
    sentiment_history = follower.get("sentiment_history", [])
    tags = follower.get("tags", [])

    positive_count = sentiment_history.count("positive")

    repeat_bonus = 15 if "repeat_visitor" in tags or "engaged" in tags else 0
    buying_bonus = 20 if "potential_customer" in tags else 0
    inactivity_penalty = 20 if "ghost" in tags else 0

    score = min(100,
        interaction_count * 6
        + positive_count * 5
        + repeat_bonus
        + buying_bonus
        - inactivity_penalty
    )
    return max(0, score)
