from typing import List, Literal, Optional, Union
import pydantic
from pydantic.fields import Field
from peltapi.utils import to_camel


class CamelModel(pydantic.BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True
        orm_mode = True


class DatabaseSchema(CamelModel):
    name: str
    system: str
    host: str
    port: int
    database: str
    user: str
    password: str


class SchemaSchema(CamelModel):
    name: str
    database: str


class TableColumnSchema(CamelModel):
    id: Optional[str]
    name: str
    datatype: str
    primary_key: Union[bool, None]
    nullable: Union[bool, None]
    unique: Union[bool, None]
    materialised: bool


class ColumnSchema(TableColumnSchema):
    table: Union[str, None]
    table_schema: Union[str, None] = Field(alias="schema")
    database: Union[str, None]


class TableSchema(CamelModel):
    id: Optional[str]
    name: str
    table_schema: Union[str, None] = Field(alias="schema")
    database: str
    columns: List[TableColumnSchema]
    materialised: bool


class TransformSchema(CamelModel):
    id: Optional[str]
    transform: str
    filter: str


class FlowEdgeSchema(CamelModel):
    source: str
    target: str
    # source: str
    # sourceHandle: str
    # target: str
    # targetHandle: str
    # id: str
    # type: str


class NodePositionSchema(CamelModel):
    x: float
    y: float


class TableNodeSchema(TableSchema):
    id: str
    type: str
    top: float
    left: float


class TransformNodeSchema(TransformSchema):
    id: str
    type: str
    top: float
    left: float


class Position2D(CamelModel):
    x: float
    y: float


class FlowSchema(CamelModel):
    id: str
    name: str
    nodes: List[Union[TableNodeSchema, TransformNodeSchema]]
    edges: List[FlowEdgeSchema]
    pan: Position2D
    zoom: float


class MetadataCreateResponse(CamelModel):
    tables: List[TableSchema]
    columns: List[ColumnSchema]


class FlowTransformDefinition(TransformSchema):
    source_col: TableColumnSchema


class ColumnDataPath(CamelModel):
    source_column: str
    target_column: str
    filter_condition: str
    source_table: str
    target_table: str


class SourceTargetColumnPairs(CamelModel):
    source: str
    target: str


class InsertTemplateContext(CamelModel):
    flow_name: str
    target_table_id: str
    target_table_name: str
    source_table_name: str
    column_names: List[SourceTargetColumnPairs]
    filter_conditions: List[str]


class ETLScriptFragment(CamelModel):
    create_script: Union[str, None]
    insert_script: Union[str, None]
    execution_order: int
    append_only: bool = False