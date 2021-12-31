from typing import Dict, List, Union
from jinja2 import Environment, PackageLoader, select_autoescape
from networkx import (
    DiGraph,
    set_node_attributes,
    set_edge_attributes,
    has_path,
    all_simple_edge_paths,
    ancestors,
    descendants,
)
from networkx.algorithms.dag import topological_sort
from peltapi.exceptions import CreateScriptExists, SelectScriptExists
from peltapi.persist.database import get_flows_collection, connect_db
from peltapi.persist.schemas import (
    ColumnDataPath,
    ETLScriptFragment,
    FlowSchema,
    InsertTemplateContext,
    SourceTargetColumnPairs,
    TableNodeSchema,
    TransformNodeSchema,
)

env = Environment(loader=PackageLoader("peltapi"), autoescape=select_autoescape())


# get flow
async def get_flow(flow_name: str):
    flow: FlowSchema = await get_flows_collection().find_one(filter={"name": flow_name})
    return flow


def get_node(id: str, nodes: List[Union[TableNodeSchema, TransformNodeSchema]]):
    matching_nodes = [x for x in nodes if x.id == id]
    return None if not matching_nodes else matching_nodes[0]


def get_tx_in_out_ids(flow: FlowSchema, tx_id: str):
    tx_in = [x.source for x in flow.edges if x.target == f"tx_{tx_id}"] or [None]
    tx_out = [x.target for x in flow.edges if x.source == f"tx_{tx_id}"] or [None]
    return (tx_in[0], tx_out[0])


def build_data_graph(flow: FlowSchema) -> DiGraph:
    source_col_ids = {x.source for x in flow.edges if x.source.split("_")[0] == "col"}
    target_col_ids = {x.target for x in flow.edges if x.target.split("_")[0] == "col"}
    flow_graph = DiGraph([(x.source, x.target) for x in flow.edges])
    edge_list = {
        (x, y)
        for x in source_col_ids
        for y in target_col_ids
        if has_path(flow_graph, x, y)
    }
    data_graph = DiGraph(list(edge_list))
    set_node_attributes(
        data_graph,
        {
            f"col_{x.id}": {
                **x.__dict__,
                "table_id": table.id,
                "table_name": table.name,
            }
            for table in flow.nodes
            if table.type == "table"
            for x in table.columns
        },
    )
    set_edge_attributes(
        data_graph,
        {get_tx_in_out_ids(flow, x.id): x for x in flow.nodes if x.type == "transform"},
    )
    return data_graph


def build_table_graph(flow: FlowSchema, data_graph: DiGraph) -> DiGraph:
    edge_list = {
        (data_graph.nodes[x[0]]["table_id"], data_graph.nodes[x[1]]["table_id"])
        for x in data_graph.edges
    }
    return DiGraph(edge_list)


def extract_data_paths(
    data_graph: DiGraph, source_cols: List, target_cols: List
) -> List[ColumnDataPath]:
    column_id_name_map = {
        f"col_{x['id']}": x["name"] for x in [*source_cols, *target_cols]
    }
    data_paths: List[ColumnDataPath] = []
    for source_col in source_cols:
        for target_col in target_cols:
            for path in all_simple_edge_paths(
                data_graph, f"col_{source_col['id']}", f"col_{target_col['id']}"
            ):
                for edge_id in path:
                    edge = data_graph.edges[edge_id]
                    if edge:
                        source_col_text = edge["transform"].format(
                            col=column_id_name_map[edge_id[0]]
                        )
                        filter_condition = edge["filter"].format(
                            col=column_id_name_map[edge_id[0]]
                        )
                    else:
                        source_col_text = column_id_name_map[edge_id[0]]
                        filter_condition = ""
                    target_col_text = column_id_name_map[edge_id[1]]
                data_paths.append(
                    ColumnDataPath(
                        source_column=source_col_text,
                        target_column=target_col_text,
                        filter_condition=filter_condition
                        if str(filter_condition).strip() != "1=1"
                        else "",
                        source_table=data_graph.nodes[edge_id[0]]["table_id"],
                        target_table=data_graph.nodes[edge_id[1]]["table_id"],
                    )
                )
    return data_paths


def create_insert_into_contexts(flow: FlowSchema, data_graph: DiGraph):
    source_cols = [
        data_graph.nodes[x] for x in data_graph.nodes if descendants(data_graph, x)
    ]
    target_cols = [
        data_graph.nodes[x] for x in data_graph.nodes if ancestors(data_graph, x)
    ]
    source_tables = {x["table_id"] for x in source_cols}
    target_tables = {x["table_id"] for x in target_cols}
    table_id_name_map = {
        x["table_id"]: x["table_name"] for x in data_graph.nodes.values()
    }

    data_paths = extract_data_paths(data_graph, source_cols, target_cols)

    insert_template_contexts: List[InsertTemplateContext] = []
    for target_table in target_tables:
        for source_table in source_tables:
            insert_context = InsertTemplateContext(
                flow_name=flow.name,
                target_table_id=target_table,
                target_table_name=table_id_name_map[target_table],
                source_table_name=table_id_name_map[source_table],
                column_names=[],
                filter_conditions=[],
            )
            for data_path in data_paths:
                if (
                    data_path.source_table == source_table
                    and data_path.target_table == target_table
                ):
                    insert_context.column_names.append(
                        SourceTargetColumnPairs(
                            source=data_path.source_column,
                            target=data_path.target_column,
                        )
                    )
                    if data_path.filter_condition:
                        insert_context.filter_conditions.append(
                            data_path.filter_condition
                        )
            insert_template_contexts.append(insert_context)
    return insert_template_contexts


def create_etl_script_fragments(
    flow: FlowSchema,
    data_graph: DiGraph,
    create_scripts: Dict[str, str],
    insert_scripts: Dict[str, str],
) -> List[ETLScriptFragment]:
    table_graph = build_table_graph(flow, data_graph)
    etl_script_fragments: List[ETLScriptFragment] = []
    for idx, table_id in enumerate(topological_sort(table_graph)):
        etl_script_fragment = ETLScriptFragment(
            create_script=create_scripts.get(table_id),
            insert_script=insert_scripts.get(table_id),
            execution_order=idx,
            append_only=False,
        )
        etl_script_fragments.append(etl_script_fragment)
    return etl_script_fragments


# parse flow
async def parse_flow(flow: FlowSchema):
    data_graph = build_data_graph(flow)
    ## work out what tables are using in flow
    unmaterialised_tables = [
        x for x in flow.nodes if x.type == "table" and x.materialised == False
    ]

    ## make create table scripts for tables that do no exist
    create_scripts = {}
    # get required templates
    template_create = env.get_template("create.sql.jinja")

    for table in unmaterialised_tables:
        # build template context
        context = {
            "flow_name": flow.name,
            "columns": table.columns,
            "table_name": table.name,
        }
        # render template
        if create_scripts.get(table.id):
            raise CreateScriptExists(table.id)
        create_scripts[table.id] = template_create.render(context)

    ## create insert into queries for the data to load target tables
    insert_scripts = {}
    template_insert = env.get_template("insert.sql.jinja")
    insert_contexts = create_insert_into_contexts(flow, data_graph)
    for context in insert_contexts:
        if insert_scripts.get(context.target_table_id):
            # raise SelectScriptExists
            pass
        insert_scripts[context.target_table_id] = template_insert.render(
            context.__dict__
        )

    return create_etl_script_fragments(flow, data_graph, create_scripts, insert_scripts)


async def test_compile_flow():
    await connect_db()
    flows_collection = await get_flows_collection()
    flow = await flows_collection.find_one({"id": "vajktvriiq"})
    flow = FlowSchema(**flow)
    return parse_flow(flow)


# def test_compile_flow():

#     template = env.get_template("select.sql.jinja")
#     print(
#         template.render(
#             flow_name="derpflow",
#             columns=["derp", "herp", "schlerp"],
#             table_name="table1",
#         )
#     )
#     print(
#         template.render(
#             flow_name="derpflow",
#             columns=["derp", "herp", "schlerp"],
#             table_name="table1",
#             where_clause="1=1",
#         )
#     )

#     template = env.get_template("create.sql.jinja")
#     print(
#         template.render(
#             flow_name="derpflow",
#             columns=[
#                 {
#                     "name": "col1",
#                     "datatype": "INTEGER",
#                     "primary_key": True,
#                     "unique": False,
#                     "null": True,
#                 },
#                 {
#                     "name": "col2",
#                     "datatype": "VARCHAR",
#                     "primary_key": False,
#                     "unique": True,
#                     "null": True,
#                 },
#                 {
#                     "name": "col3",
#                     "datatype": "DATETIME",
#                     "primary_key": False,
#                     "unique": False,
#                     "null": False,
#                 },
#                 {
#                     "name": "col4",
#                     "datatype": "DATETIME",
#                     "primary_key": True,
#                     "unique": True,
#                     "null": False,
#                 },
#             ],
#             table_name="table1",
#         )
#     )

#     template = env.get_template("insert.sql.jinja")
#     print(
#         template.render(
#             flow_name="derpflow",
#             rows=[
#                 {
#                     "derp": "'col1'",
#                     "schlerp": 1,
#                 },
#                 {
#                     "derp": "'col1 2'",
#                     "schlerp": 1,
#                 },
#             ],
#             table_name="table1",
#         )
#     )