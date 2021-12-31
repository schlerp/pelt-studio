from typing import Any, List, Union
from fastapi import APIRouter, Response, HTTPException

from peltapi.persist import schemas
from peltapi.persist.database import get_flows_collection
from peltapi.sql.compile_flow import test_compile_flow, parse_flow


tags_metadata = [
    {
        "name": "Compile",
        "description": "Endpoints for perofrming CRUD operations on Flows",
    },
]


router = APIRouter()


@router.post(
    "/flow/compile",
    tags=["Compile"],
    response_model=List[schemas.ETLScriptFragment],
    status_code=200,
)
async def compile_flow(flow: schemas.FlowSchema, response: Response):
    """Compile the passed flow"""
    return parse_flow(flow)


@router.get(
    "/flow/compile/{flow_id}",
    tags=["Compile"],
    response_model=List[schemas.ETLScriptFragment],
    status_code=200,
)
async def compile_flow(flow_id: str, response: Response):
    """Compile the passed flow"""
    flows_collection = await get_flows_collection()
    flow = await flows_collection.find_one({"id": flow_id})
    flow = schemas.FlowSchema(**flow)
    if flow:
        return await parse_flow(flow)
    return HTTPException(404, f"flow {flow_id} not found!")


@router.get(
    "/flow/compile/test",
    tags=["Compile"],
    # response_model=Union[List[schemas.FlowSchema], None],
    status_code=200,
)
async def test_compile(response: Response):
    """Compile the passed flow"""
    return await test_compile_flow()
