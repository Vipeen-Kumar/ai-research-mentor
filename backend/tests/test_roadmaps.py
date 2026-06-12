from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_list_roadmaps():
    response = client.get("/api/v1/roadmaps")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_nonexistent_roadmap():
    response = client.get("/api/v1/roadmaps/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404


def test_generate_and_get_roadmap():
    # 1. Generate a roadmap
    gen_response = client.post("/api/v1/roadmaps/generate", json={"topic": "Neural Networks"})
    assert gen_response.status_code == 201
    gen_data = gen_response.json()
    assert "roadmap_id" in gen_data
    roadmap_id = gen_data["roadmap_id"]
    topic = gen_data["topic"]

    # 2. Get the roadmap by id
    get_response = client.get(f"/api/v1/roadmaps/{roadmap_id}")
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["id"] == roadmap_id
    assert get_data["topic"] == topic
    assert "nodes" in get_data
    assert "edges" in get_data
    assert len(get_data["nodes"]) > 0

    # 3. List roadmaps and check if the generated one is in the list
    list_response = client.get("/api/v1/roadmaps")
    assert list_response.status_code == 200
    list_data = list_response.json()
    assert len(list_data) > 0
    # The first one should be the one we just generated (newest first)
    assert list_data[0]["id"] == roadmap_id
    assert list_data[0]["topic"] == topic
    assert list_data[0]["node_count"] == len(get_data["nodes"])
    assert "created_at" in list_data[0]
