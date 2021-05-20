from typing import List, Union
from fastapi import APIRouter
from fastapi import Response

from peltapi.persist import schemas
from peltapi.persist.database import get_columns_collection


tags_metadata = [
    {
        "name": "Columns",
        "description": "Endpoints for perofrming CRUD operations on Columns",
    },
]


router = APIRouter()


@router.get(
    "/column",
    tags=["Columns"],
    response_model=Union[List[schemas.ColumnSchema], None],
    status_code=200,
)
async def api_get_all_columns(response: Response):
    """Get all defined column definitions matching the filters and pagination."""
    columns_collection = await get_columns_collection()
    return [x async for x in columns_collection.find()]


@router.post(
    "/column",
    tags=["Columns"],
    response_model=schemas.ColumnSchema,
    status_code=201,
)
async def api_create_column(column: schemas.ColumnSchema):
    """Create a new column definition"""
    columns_collection = await get_columns_collection()
    await columns_collection.replace_one(
        filter={"name": column.name},
        replacement=column.dict(),
        upsert=True,
    )
    return await columns_collection.find_one(filter={"name": column.name})


@router.get(
    "/column/{column_id}",
    tags=["Columns"],
    response_model=schemas.ColumnSchema,
    status_code=200,
)
async def api_get_column(column_id: str):
    """Get a column definition with the given name."""
    columns_collection = await get_columns_collection()
    return await columns_collection.find_one(filter={"name": column_id})


@router.put(
    "/column/{column_id}",
    tags=["Columns"],
    response_model=schemas.ColumnSchema,
    status_code=200,
)
async def api_update_column(column_id: str, column: schemas.ColumnSchema):
    """Update a column definition with the given name."""
    if column.name != column_id:
        return Response("column object name and url do not match!", status_code=400)

    columns_collection = await get_columns_collection()
    await columns_collection.update_one(
        filter={"name": column_id},
        update=column,
        upsert=True,
    )
    return await columns_collection.find_one(filter={"name": column_id})


@router.delete(
    "/column/{column_id}",
    tags=["Columns"],
    response_model=bool,
    status_code=200,
)
async def api_delete_column(column_id: str):
    """Delete a column definition with the given name."""
    columns_collection = await get_columns_collection()
    result = await columns_collection.delete_one(filter={"name": column_id})
    if result.deleted_count:
        return Response(f"column config {column_id} deleted!")
    return Response(f"no column config {column_id} to delete!", status_code=400)
