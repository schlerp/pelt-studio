from typing import List, Union
from fastapi import APIRouter
from fastapi import Response

from peltapi.persist import schemas
from peltapi.persist.database import get_transforms_collection


tags_metadata = [
    {
        "name": "Transforms",
        "description": "Endpoints for perofrming CRUD operations on Transforms",
    },
]


router = APIRouter()


@router.get(
    "/table",
    tags=["Transforms"],
    response_model=Union[List[schemas.TransformSchema], None],
    status_code=200,
)
async def api_get_all_transforms(response: Response):
    """Get all defined table definitions matching the filters and pagination."""
    transforms_collection = await get_transforms_collection()
    return [x async for x in transforms_collection.find()]


@router.post(
    "/table",
    tags=["Transforms"],
    response_model=schemas.TransformSchema,
    status_code=201,
)
async def api_create_table(table: schemas.TransformSchema):
    """Create a new table definition"""
    transforms_collection = await get_transforms_collection()
    await transforms_collection.replace_one(
        filter={"name": table.name},
        replacement=table.dict(),
        upsert=True,
    )
    return await transforms_collection.find_one(filter={"name": table.name})


@router.get(
    "/table/{table_id}",
    tags=["Transforms"],
    response_model=schemas.TransformSchema,
    status_code=200,
)
async def api_get_table(table_id: str):
    """Get a table definition with the given name."""
    transforms_collection = await get_transforms_collection()
    return await transforms_collection.find_one(filter={"name": table_id})


@router.put(
    "/table/{table_id}",
    tags=["Transforms"],
    response_model=schemas.TransformSchema,
    status_code=200,
)
async def api_update_table(table_id: str, table: schemas.TransformSchema):
    """Update a table definition with the given name."""
    if table.name != table_id:
        return Response("table object name and url do not match!", status_code=400)

    transforms_collection = await get_transforms_collection()
    await transforms_collection.update_one(
        filter={"name": table_id},
        update=table,
        upsert=True,
    )
    return await transforms_collection.find_one(filter={"name": table_id})


@router.delete(
    "/table/{table_id}",
    tags=["Transforms"],
    status_code=200,
)
async def api_delete_table(table_id: str):
    """Delete a table definition with the given name."""
    transforms_collection = await get_transforms_collection()
    result = await transforms_collection.delete_one(filter={"name": table_id})
    if result.deleted_count:
        return Response(f"table config {table_id} deleted!")
    return Response(f"no table config {table_id} to delete!", status_code=400)
