from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class TicketStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"


class TicketPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TicketBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    customer_name: str = Field(min_length=1, max_length=150, alias="customerName")
    customer_email: EmailStr = Field(alias="customerEmail")
    priority: TicketPriority

    model_config = ConfigDict(populate_by_name=True)


class TicketCreate(TicketBase):
    pass


class TicketStatusUpdate(BaseModel):
    status: TicketStatus


class TicketRead(BaseModel):
    id: int
    title: str
    description: str
    customer_name: str = Field(serialization_alias="customerName")
    customer_email: str = Field(serialization_alias="customerEmail")
    status: TicketStatus
    priority: TicketPriority
    created_at: datetime = Field(serialization_alias="createdAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class TicketListResponse(BaseModel):
    items: list[TicketRead]
    total: int
    page: int
    page_size: int = Field(serialization_alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)


class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    email: str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str = Field(serialization_alias="accessToken")
    token_type: str = Field(default="bearer", serialization_alias="tokenType")

    model_config = ConfigDict(populate_by_name=True)
