from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Ticket, User
from app.schemas import TicketCreate, TicketStatus, TicketPriority

SORT_FIELDS = {
    "created_at": Ticket.created_at.asc(),
    "-created_at": Ticket.created_at.desc(),
    "priority": Ticket.priority.asc(),
    "-priority": Ticket.priority.desc(),
}


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, *, email: str, hashed_password: str) -> User:
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def list_tickets(
    db: AsyncSession,
    *,
    status: TicketStatus | None = None,
    priority: TicketPriority | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
    sort: str = "-created_at",
) -> tuple[list[Ticket], int]:
    filters = []
    if status is not None:
        filters.append(Ticket.status == status.value)
    if priority is not None:
        filters.append(Ticket.priority == priority.value)
    if search:
        pattern = f"%{search}%"
        filters.append(or_(Ticket.title.ilike(pattern), Ticket.customer_name.ilike(pattern)))

    count_stmt = select(func.count()).select_from(Ticket)
    if filters:
        count_stmt = count_stmt.where(*filters)
    total = (await db.execute(count_stmt)).scalar_one()

    order_by = SORT_FIELDS.get(sort, Ticket.created_at.desc())
    stmt = select(Ticket).order_by(order_by)
    if filters:
        stmt = stmt.where(*filters)
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    return list(result.scalars().all()), total


async def get_ticket(db: AsyncSession, ticket_id: int) -> Ticket | None:
    return await db.get(Ticket, ticket_id)


async def create_ticket(db: AsyncSession, data: TicketCreate) -> Ticket:
    ticket = Ticket(
        title=data.title,
        description=data.description,
        customer_name=data.customer_name,
        customer_email=data.customer_email,
        priority=data.priority.value,
        status=TicketStatus.open.value,
    )
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket


async def update_ticket_status(db: AsyncSession, ticket_id: int, status: TicketStatus) -> Ticket | None:
    ticket = await db.get(Ticket, ticket_id)
    if ticket is None:
        return None
    ticket.status = status.value
    await db.commit()
    await db.refresh(ticket)
    return ticket
