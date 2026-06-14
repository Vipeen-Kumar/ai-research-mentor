#!/usr/bin/env python
"""Test a single roadmap generation."""

import json
import sys
import time
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=" * 80)
print("Testing Single Roadmap Generation with Gemini - Computer Vision")
print("=" * 80)

payload = {"topic": "Computer Vision"}
response = client.post("/api/v1/roadmaps/generate", json=payload)
print(f"\nStatus Code: {response.status_code}")

if response.status_code == 201:
    data = response.json()
    print(f"\n✓ SUCCESS - Generated Roadmap for: {data['topic']}")
    print(f"Provider: {data['provider']}")
    print(f"Summary: {data['summary']}")
    print(f"\nNodes ({len(data['nodes'])} total):")
    for i, node in enumerate(data['nodes'], 1):
        print(f"  {i}. {node['title']} ({node['description'][:60]}...)")
    print(f"\nEdges ({len(data['edges'])} total):")
    for edge in data['edges'][:3]:
        print(f"  {edge}")
else:
    print(f"\nError Status: {response.status_code}")
    print(f"Response: {response.text}")
    try:
        print(f"JSON: {json.dumps(response.json(), indent=2)}")
    except:
        pass

print("\n" + "=" * 80)
