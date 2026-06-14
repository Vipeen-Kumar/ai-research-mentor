#!/usr/bin/env python
"""Check database for generated roadmaps."""

from app.db.session import SessionLocal
from app.models import Roadmap

db = SessionLocal()

# Get all roadmaps
roadmaps = db.query(Roadmap).all()
print(f"Total roadmaps in DB: {len(roadmaps)}")

if roadmaps:
    for roadmap in roadmaps[-3:]:  # Get the last 3 (most recent)
        print(f"\n{'=' * 60}")
        print(f"Roadmap ID: {roadmap.id}")
        print(f"Topic: {roadmap.topic_name}")
        print(f"Provider: {roadmap.provider}")
        print(f"Summary: {roadmap.summary[:100]}...")
        print(f"Nodes: {len(roadmap.nodes)}")
        for node in roadmap.nodes:
            print(f"  - {node.title}")
            print(f"    Difficulty: {getattr(node, 'difficulty', 'N/A')}")
            print(f"    Description: {node.description[:60]}...")

db.close()
