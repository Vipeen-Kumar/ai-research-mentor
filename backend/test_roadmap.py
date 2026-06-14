#!/usr/bin/env python
"""Test the roadmap generation endpoint."""

import json
import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("=" * 60)
print("Testing Roadmap Generation with Gemini")
print("=" * 60)

# Test 1: Computer Vision
print("\nTest 1: Computer Vision")
payload = {"topic": "Computer Vision"}
response = client.post("/api/v1/roadmaps/generate", json=payload)
print(f"Status Code: {response.status_code}")
if response.status_code == 201:
    data = response.json()
    print(f"Topic: {data['topic']}")
    print(f"Nodes: {[n['title'] for n in data['nodes']]}")
else:
    print(f"Error: {response.text}")
    print(f"JSON: {response.json()}")

# Test 2: Signal Processing
print("\nTest 2: Signal Processing")
payload = {"topic": "Signal Processing"}
response = client.post("/api/v1/roadmaps/generate", json=payload)
print(f"Status Code: {response.status_code}")
if response.status_code == 201:
    data = response.json()
    print(f"Topic: {data['topic']}")
    print(f"Nodes: {[n['title'] for n in data['nodes']]}")
else:
    print(f"Error: {response.text}")
    print(f"JSON: {response.json()}")

# Test 3: Quantum Computing
print("\nTest 3: Quantum Computing")
payload = {"topic": "Quantum Computing"}
response = client.post("/api/v1/roadmaps/generate", json=payload)
print(f"Status Code: {response.status_code}")
if response.status_code == 201:
    data = response.json()
    print(f"Topic: {data['topic']}")
    print(f"Nodes: {[n['title'] for n in data['nodes']]}")
else:
    print(f"Error: {response.text}")
    print(f"JSON: {response.json()}")

print("\n" + "=" * 60)
print("All tests complete")
print("=" * 60)
