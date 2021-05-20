from sqlalchemy.orm.session import Session
from sqlalchemy import MetaData
from sqlalchemy.engine.base import Engine

from peltapi.persist.database import get_tables_collection, get_columns_collection


extract_metadata_sql = """
SELECT DISTINCT
    isc.table_catalog as [database],
    isc.table_schema as [schema],
    isc.table_name as [table],
    isc.column_name as [column],
    isc.ordinal_position as [sort_order],
    isc.is_nullable as [nullable],
    isc.data_type as [dtype],
    isc.character_maximum_length as [max_len],
    isc.character_octet_length as [octet_len]
FROM
    INFORMATION_SCHEMA.COLUMNS isc
"""


def get_metadata(engine: Engine):
    meta = MetaData()
    meta.reflect(bind=engine)
    print(meta)
    return meta


async def load_metadata(engine: Engine, database_id: str):
    meta = get_metadata(engine)
    tables = []
    columns = []
    tables_collection = await get_tables_collection()
    columns_collection = await get_columns_collection()
    for table in meta.sorted_tables:
        table_columns = []
        for column in table.columns:
            column_dict = dict(
                name=column.name,
                datatype=column.type.as_generic().compile(),
                primary_key=column.primary_key,
                nullable=column.nullable,
                unique=column.unique,
                table=table.name,
                schema=table.schema,
                database=database_id,
                materialised=True,
            )
            columns_collection.replace_one(
                filter={"name": column_dict["name"]},
                replacement=column_dict,
                upsert=True,
            )
            columns.append(column_dict)

            table_column_dict = dict(
                name=column.name,
                datatype=column.type.as_generic().compile(),
                primary_key=column.primary_key,
                nullable=column.nullable,
                unique=column.unique,
                materialised=True,
            )
            table_columns.append(table_column_dict)
        table_dict = dict(
            name=table.name,
            schema=table.schema,
            database=database_id,
            materialised=True,
            columns=table_columns,
        )
        tables_collection.replace_one(
            filter={"name": table_dict["name"]},
            replacement=table_dict,
            upsert=True,
        )
        tables.append(table_dict)
    return {"tables": tables, "columns": columns}
