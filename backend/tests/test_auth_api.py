from httpx import AsyncClient


async def test_signup_creates_user_and_returns_token(client: AsyncClient):
    response = await client.post(
        "/api/auth/signup", json={"email": "new@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert "accessToken" in response.json()


async def test_signup_duplicate_email_returns_409(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "password123"}
    first = await client.post("/api/auth/signup", json=payload)
    assert first.status_code == 201

    second = await client.post("/api/auth/signup", json=payload)
    assert second.status_code == 409


async def test_login_wrong_password_returns_401(client: AsyncClient):
    await client.post(
        "/api/auth/signup", json={"email": "loginuser@example.com", "password": "correct-password"}
    )
    response = await client.post(
        "/api/auth/login", json={"email": "loginuser@example.com", "password": "wrong-password"}
    )
    assert response.status_code == 401


async def test_list_tickets_without_token_returns_401(client: AsyncClient):
    response = await client.get("/api/tickets")
    assert response.status_code == 401
