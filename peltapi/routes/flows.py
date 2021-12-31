from typing import Any, List, Union
from fastapi import APIRouter
from fastapi import Response

from peltapi.persist import schemas
from peltapi.persist.database import get_flows_collection


tags_metadata = [
    {
        "name": "Flows",
        "description": "Endpoints for perofrming CRUD operations on Flows",
    },
]


router = APIRouter()


@router.get(
    "/flow",
    tags=["Flows"],
    # response_model=Union[List[schemas.FlowSchema], None],
    status_code=200,
)
async def api_get_all_flows(response: Response):
    """Get all defined flow definitions matching the filters and pagination."""
    flows_collection = await get_flows_collection()
    return [x async for x in flows_collection.find(projection={"_id": 0})]


@router.post(
    "/flow",
    tags=["Flows"],
    response_model=schemas.FlowSchema,
    status_code=201,
)
async def api_create_flow(flow: schemas.FlowSchema):
    """Create a new flow definition"""
    flows_collection = await get_flows_collection()
    await flows_collection.replace_one(
        filter={"id": flow.id},
        replacement=flow.dict(),
        upsert=True,
    )
    return await flows_collection.find_one(
        filter={"id": flow.id}, projection={"_id": 0}
    )


@router.get(
    "/flow/{flow_id}",
    tags=["Flows"],
    response_model=schemas.FlowSchema,
    status_code=200,
)
async def api_get_flow(flow_id: str):
    """Get a flow definition with the given name."""
    flows_collection = await get_flows_collection()
    return await flows_collection.find_one(
        filter={"id": flow_id}, projection={"_id": 0}
    )


@router.put(
    "/flow/{flow_id}",
    tags=["Flows"],
    response_model=schemas.FlowSchema,
    status_code=200,
)
async def api_update_flow(flow_id: str, flow: schemas.FlowSchema):
    """Update a flow definition with the given name."""
    if flow.id != flow_id:
        return Response("flow object id and url do not match!", status_code=400)

    flows_collection = await get_flows_collection()
    await flows_collection.replace_one(
        filter={"id": flow_id},
        replacement=flow.dict(),
        upsert=True,
    )
    return await flows_collection.find_one(
        filter={"id": flow_id}, projection={"_id": 0}
    )


@router.delete(
    "/flow/{flow_id}",
    tags=["Flows"],
    response_model=bool,
    status_code=200,
)
async def api_delete_flow(flow_id: str):
    """Delete a flow definition with the given name."""
    flows_collection = await get_flows_collection()
    result = await flows_collection.delete_one(filter={"id": flow_id})
    if result.deleted_count:
        return Response(f"flow config {flow_id} deleted!")
    return Response(f"no flow config {flow_id} to delete!", status_code=400)
