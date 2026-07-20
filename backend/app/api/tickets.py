from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.db import get_db
from app.exceptions import TicketNotFoundError
from app.models import User
from app.schemas import (
    TicketCreate,
    TicketListResponse,
    TicketPriority,
    TicketRead,
    TicketStatus,
    TicketStatusUpdate,
)
from app.security import get_current_user

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.get("", response_model=TicketListResponse)
async def list_tickets(
    status: TicketStatus | None = None,
    priority: TicketPriority | None = None,
    search: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: Literal["created_at", "-created_at", "priority", "-priority"] = "-created_at",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketListResponse:
    tickets, total = await crud.list_tickets(
        db,
        status=status,
        priority=priority,
        search=search,
        page=page,
        page_size=page_size,
        sort=sort,
    )
    return TicketListResponse(
        items=[TicketRead.model_validate(t) for t in tickets],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{ticket_id}", response_model=TicketRead)
async def get_ticket(
    ticket_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketRead:
    ticket = await crud.get_ticket(db, ticket_id)
    if ticket is None:
        raise TicketNotFoundError()
    return TicketRead.model_validate(ticket)


@router.post("", response_model=TicketRead, status_code=201)
async def create_ticket(
    data: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketRead:
    ticket = await crud.create_ticket(db, data)
    return TicketRead.model_validate(ticket)


@router.patch("/{ticket_id}", response_model=TicketRead)
async def update_ticket_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TicketRead:
    ticket = await crud.update_ticket_status(db, ticket_id, data.status)
    if ticket is None:
        raise TicketNotFoundError()
    return TicketRead.model_validate(ticket)
