from typing import List, Union
from fastapi import APIRouter
from fastapi import Response

from peltapi.persist import schemas
from peltapi.persist.database import get_db_conf_collection
from peltapi.etl.metadata import load_metadata
from peltapi.etl.connection import create_engine_from_database_def, test_connection


tags_metadata = [
    {
        "name": "Databases",
        "description": "Endpoints for perofrming CRUD operations on Databases",
    },
]


router = APIRouter()


@router.get(
    "/database",
    tags=["Databases"],
    response_model=Union[List[schemas.DatabaseSchema], None],
    status_code=200,
)
async def api_get_all_databases(response: Response):
    """Get all defined database definitions matching the filters and pagination."""
    db_conf_collection = await get_db_conf_collection()
    return [x async for x in db_conf_collection.find()]


@router.post(
    "/database",
    tags=["Databases"],
    response_model=schemas.DatabaseSchema,
    status_code=201,
)
async def api_create_database(database: schemas.DatabaseSchema):
    """Create a new database definition"""
    db_conf_collection = await get_db_conf_collection()
    await db_conf_collection.replace_one(
        filter={"name": database.name},
        replacement=database.dict(),
        upsert=True,
    )
    return await db_conf_collection.find_one(filter={"name": database.name})


@router.get(
    "/database/{database_id}",
    tags=["Databases"],
    response_model=schemas.DatabaseSchema,
    status_code=200,
)
async def api_get_database(database_id: str):
    """Get a database definition with the given name."""
    db_conf_collection = await get_db_conf_collection()
    return await db_conf_collection.find_one(filter={"name": database_id})


@router.put(
    "/database/{database_id}",
    tags=["Databases"],
    response_model=schemas.DatabaseSchema,
    status_code=200,
)
async def api_update_database(database_id: str, database: schemas.DatabaseSchema):
    """Update a database definition with the given name."""
    if database.name != database_id:
        return Response("database object name and url do not match!", status_code=400)

    db_conf_collection = await get_db_conf_collection()
    await db_conf_collection.update_one(
        filter={"name": database_id},
        update=database,
        upsert=True,
    )
    return await db_conf_collection.find_one(filter={"name": database_id})


@router.delete(
    "/database/{database_id}",
    tags=["Databases"],
    response_model=bool,
    status_code=200,
)
async def api_delete_database(database_id: str):
    """Delete a database definition with the given name."""
    db_conf_collection = await get_db_conf_collection()
    result = await db_conf_collection.delete_one(filter={"name": database_id})
    if result.deleted_count:
        return Response(f"database config {database_id} deleted!")
    return Response(f"no database config {database_id} to delete!", status_code=400)


@router.get(
    "/database/metadata/{database_id}",
    tags=["Databases"],
    response_model=schemas.MetadataCreateResponse,
    status_code=200,
)
async def api_load_database_metadata(database_id: str):
    """Load the metadata into application using database definition with the given name."""
    db_conf_collection = await get_db_conf_collection()
    database = db_conf_collection.find_one(filter={"name": database_id})
    engine = await create_engine_from_database_def(database)
    if await test_connection(engine):
        return await load_metadata(engine, database_id)
    return Response(f"could not connect to database {database_id}!", status_code=400)
