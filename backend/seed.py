import asyncio

from sqlalchemy import func, select

from app.db import AsyncSessionLocal
from app.models import Ticket, User
from app.security import hash_password

DEMO_USER_EMAIL = "testerson@test.com"
DEMO_USER_PASSWORD = "Test12345"

SAMPLE_TICKETS = [
    dict(title="Unable to complete payment", description="Customer gets an error after submitting the payment form.", customer_name="Jane Smith", customer_email="jane@example.com", status="open", priority="high"),
    dict(title="Password reset email not arriving", description="Customer requested a reset link twice, nothing in inbox or spam.", customer_name="Miguel Torres", customer_email="miguel@example.com", status="open", priority="medium"),
    dict(title="Dashboard chart shows wrong totals", description="Monthly revenue chart looks off by roughly 10%.", customer_name="Aiko Tanaka", customer_email="aiko@example.com", status="in_progress", priority="high"),
    dict(title="Feature request: dark mode", description="Customer would like a dark theme option in settings.", customer_name="Sam Okafor", customer_email="sam@example.com", status="open", priority="low"),
    dict(title="Export to CSV times out", description="Exports over 5,000 rows fail with a timeout.", customer_name="Priya Nair", customer_email="priya@example.com", status="in_progress", priority="medium"),
    dict(title="Duplicate invoice sent", description="Customer was billed twice for the same invoice number.", customer_name="Carlos Mendes", customer_email="carlos@example.com", status="resolved", priority="high"),
    dict(title="Typo on the pricing page", description="\"Enterpise\" is misspelled under the top plan.", customer_name="Lena Fischer", customer_email="lena@example.com", status="resolved", priority="low"),
    dict(title="API key regeneration not working", description="Clicking regenerate spins forever with no new key shown.", customer_name="Noah Williams", customer_email="noah@example.com", status="open", priority="medium"),
    dict(title="Mobile app crashes on login", description="Crash reproduced on iOS 17 immediately after entering credentials.", customer_name="Grace Kim", customer_email="grace@example.com", status="in_progress", priority="high"),
]


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        ticket_count = (await session.execute(select(func.count()).select_from(Ticket))).scalar_one()
        if ticket_count == 0:
            session.add_all(Ticket(**data) for data in SAMPLE_TICKETS)
            print(f"Seeded {len(SAMPLE_TICKETS)} sample tickets.")
        else:
            print("Tickets table already has data, skipping ticket seed.")

        existing_user = (
            await session.execute(select(User).where(User.email == DEMO_USER_EMAIL))
        ).scalar_one_or_none()
        if existing_user is None:
            session.add(User(email=DEMO_USER_EMAIL, hashed_password=hash_password(DEMO_USER_PASSWORD)))
            print(f"Seeded demo user: {DEMO_USER_EMAIL} / {DEMO_USER_PASSWORD}")
        else:
            print("Demo user already exists, skipping user seed.")

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
