from typing import List, Optional, Union
import pydantic
from pydantic.fields import Field


class DatabaseSchema(pydantic.BaseModel):
    name: str
    system: str
    host: str
    port: int
    database: str
    user: str
    password: str


class SchemaSchema(pydantic.BaseModel):
    name: str
    database: str


class ColumnSchema(pydantic.BaseModel):
    name: str
    datatype: str
    primary_key: Union[bool, None]
    nullable: Union[bool, None]
    unique: Union[bool, None]
    table: Union[str, None]
    table_schema: Union[str, None] = Field(alias="schema")
    database: Union[str, None]
    materialised: bool


class TableColumnSchema(pydantic.BaseModel):
    name: str
    datatype: str
    primary_key: Union[bool, None]
    nullable: Union[bool, None]
    unique: Union[bool, None]
    materialised: bool


class TableSchema(pydantic.BaseModel):
    name: str
    table_schema: Union[str, None] = Field(alias="schema")
    database: str
    columns: List[TableColumnSchema]


class TransformSchema(pydantic.BaseModel):
    name: str
    transform: str
    filter: str


class LegacyNodeSchema(pydantic.BaseModel):
    type: str
    column: str
    unique_id: str


class FlowEdgeSchema(pydantic.BaseModel):
    source: str
    sourceHandle: str
    target: str
    targetHandle: str
    id: str
    type: str


class NodePositionSchema(pydantic.BaseModel):
    x: float
    y: float


class NodeSchema(pydantic.BaseModel):
    id: str
    type: str
    data: Union[LegacyNodeSchema, ColumnSchema, TransformSchema]
    position: NodePositionSchema


class FlowSchema(pydantic.BaseModel):
    id: str
    elements: List[Union[NodeSchema, FlowEdgeSchema]]
    position: List[float]
    zoom: float


class MetadataCreateResponse(pydantic.BaseModel):
    tables: List[TableSchema]
    columns: List[ColumnSchema]
