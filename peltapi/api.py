import fastapi
from fastapi.middleware.cors import CORSMiddleware

from peltapi.config import config
from peltapi.persist.database import connect_db, close_db
from peltapi.routes import databases, tables, columns, flows


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


# set up middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8321)
