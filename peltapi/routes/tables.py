from typing import List, Union
from fastapi import APIRouter
from fastapi import Response

from peltapi.persist import schemas
from peltapi.persist.database import get_tables_collection


tags_metadata = [
    {
        "name": "Tables",
        "description": "Endpoints for perofrming CRUD operations on Tables",
    },
]


router = APIRouter()


@router.get(
    "/table",
    tags=["Tables"],
    response_model=Union[List[schemas.TableSchema], None],
    status_code=200,
)
async def api_get_all_tables(response: Response):
    """Get all defined table definitions matching the filters and pagination."""
    tables_collection = await get_tables_collection()
    return [x async for x in tables_collection.find()]


@router.post(
    "/table",
    tags=["Tables"],
    response_model=schemas.TableSchema,
    status_code=201,
)
async def api_create_table(table: schemas.TableSchema):
    """Create a new table definition"""
    tables_collection = await get_tables_collection()
    await tables_collection.replace_one(
        filter={"name": table.name},
        replacement=table.dict(),
        upsert=True,
    )
    return await tables_collection.find_one(filter={"name": table.name})


@router.get(
    "/table/{table_id}",
    tags=["Tables"],
    response_model=schemas.TableSchema,
    status_code=200,
)
async def api_get_table(table_id: str):
    """Get a table definition with the given name."""
    tables_collection = await get_tables_collection()
    return await tables_collection.find_one(filter={"name": table_id})


@router.put(
    "/table/{table_name}",
    tags=["Tables"],
    response_model=schemas.TableSchema,
    status_code=200,
)
async def api_update_table(table_name: str, table: schemas.TableSchema):
    """Update a table definition with the given name."""
    if table.name != table_name:
        return Response("table object name and url do not match!", status_code=400)

    tables_collection = await get_tables_collection()
    await tables_collection.replace_one(
        filter={"name": table_name},
        replacement=table.dict(),
        upsert=True,
    )
    return await tables_collection.find_one(filter={"name": table_name})


@router.delete(
    "/table/{table_name}",
    tags=["Tables"],
    response_model=bool,
    status_code=200,
)
async def api_delete_table(table_name: str):
    """Delete a table definition with the given name."""
    tables_collection = await get_tables_collection()
    result = await tables_collection.delete_one(filter={"name": table_name})
    if result.deleted_count:
        return Response(f"table config {table_name} deleted!", media_type="text/plain")
    return Response(
        f"no table config {table_name} to delete!",
        status_code=400,
        media_type="text/plain",
    )
