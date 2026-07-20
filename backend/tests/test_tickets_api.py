from httpx import AsyncClient

VALID_TICKET = {
    "title": "Unable to complete payment",
    "description": "The customer receives an error after submitting the payment form.",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "priority": "high",
}


async def test_create_ticket_missing_title_returns_422(client: AsyncClient, auth_headers: dict[str, str]):
    payload = {**VALID_TICKET}
    del payload["title"]
    response = await client.post("/api/tickets", json=payload, headers=auth_headers)
    assert response.status_code == 422


async def test_create_ticket_invalid_email_returns_422(client: AsyncClient, auth_headers: dict[str, str]):
    payload = {**VALID_TICKET, "customerEmail": "not-an-email"}
    response = await client.post("/api/tickets", json=payload, headers=auth_headers)
    assert response.status_code == 422


async def test_create_ticket_persists_and_defaults_to_open(client: AsyncClient, auth_headers: dict[str, str]):
    create_response = await client.post("/api/tickets", json=VALID_TICKET, headers=auth_headers)
    assert create_response.status_code == 201
    body = create_response.json()
    assert body["status"] == "open"

    get_response = await client.get(f"/api/tickets/{body['id']}", headers=auth_headers)
    assert get_response.status_code == 200
    assert get_response.json()["title"] == VALID_TICKET["title"]


async def test_update_ticket_status_persists(client: AsyncClient, auth_headers: dict[str, str]):
    create_response = await client.post("/api/tickets", json=VALID_TICKET, headers=auth_headers)
    ticket_id = create_response.json()["id"]

    patch_response = await client.patch(
        f"/api/tickets/{ticket_id}", json={"status": "in_progress"}, headers=auth_headers
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == "in_progress"

    get_response = await client.get(f"/api/tickets/{ticket_id}", headers=auth_headers)
    assert get_response.json()["status"] == "in_progress"


async def test_get_ticket_not_found_returns_404(client: AsyncClient, auth_headers: dict[str, str]):
    response = await client.get("/api/tickets/999999", headers=auth_headers)
    assert response.status_code == 404
    assert "detail" in response.json()
