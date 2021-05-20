from sqlalchemy import create_engine
from sqlalchemy.engine.base import Engine
from peltapi.persist.schemas import DatabaseSchema


class SYSTEMS:
    MSSQL = "mssql"
    POSTGRESQL = "postgresql"


# TODO: refactor this
async def build_connection_string(database: DatabaseSchema):
    database = await database
    if database["system"].lower() == SYSTEMS.MSSQL:
        con_string = (
            "mssql+pyodbc://"
            "{user}:{pwd}"
            "@{host}:{port}/{database}"
            "?driver=ODBC+Driver+17+for+SQL+Server"
        )

    elif database["system"].lower() == SYSTEMS.POSTGRESQL:
        con_string = "postgresql+psycopg2://{user}:{pwd}@{host}:{port}/{database}"

    return con_string.format(
        user=database["user"],
        pwd=database["password"],
        host=database["host"],
        port=database["port"],
        database=database["database"],
    )


async def create_engine_from_database_def(database: DatabaseSchema):
    return create_engine(await build_connection_string(database))


async def test_connection(engine: Engine):
    try:
        con = engine.connect()
        return True
    except ConnectionError:
        return False
