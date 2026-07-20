from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.auth import router as auth_router
from app.api.tickets import router as tickets_router
from app.config import settings
from app.exceptions import EmailAlreadyRegisteredError, InvalidCredentialsError, TicketNotFoundError

app = FastAPI(title="Aurexillion Support Ticket Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.exception_handler(TicketNotFoundError)
async def ticket_not_found_handler(request: Request, exc: TicketNotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": "Ticket not found"})


@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError) -> JSONResponse:
    return JSONResponse(status_code=401, content={"detail": "Invalid credentials"})


@app.exception_handler(EmailAlreadyRegisteredError)
async def email_already_registered_handler(request: Request, exc: EmailAlreadyRegisteredError) -> JSONResponse:
    return JSONResponse(status_code=409, content={"detail": "Email already registered"})


app.include_router(auth_router)
app.include_router(tickets_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
