import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.logger import logger
from fastapi import status, Request

from peltapi.config import config
from peltapi.persist.database import connect_db, close_db
from peltapi.routes import databases, tables, columns, flows, compile


app = fastapi.FastAPI(
    title=config["title"],
    description=config["description"],
    version="0.0.1",
)


# set up application database
app.add_event_handler("startup", connect_db)
app.add_event_handler("shutdown", close_db)


# add router endpoints
app.include_router(databases.router)
app.include_router(tables.router)
app.include_router(columns.router)
app.include_router(flows.router)
app.include_router(compile.router)


# set up middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: Remove this exception handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    # or logger.error(f'{exc}')
    logger.error(request, exc_str)
    content = {"status_code": 10422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8321)
