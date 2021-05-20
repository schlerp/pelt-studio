from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
    AsyncIOMotorCollection,
)
from peltapi.config import config


client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None
db_conf_collection: AsyncIOMotorCollection = None
tables_collection: AsyncIOMotorCollection = None
columns_collection: AsyncIOMotorCollection = None
transforms_collection: AsyncIOMotorCollection = None
flows_collection: AsyncIOMotorCollection = None


async def connect_db():
    """Create database connection."""
    global client
    client = AsyncIOMotorClient(
        host=config["mongo_host"],
        port=config["mongo_port"],
    )
    global db
    db = client[config["metadata_database"]]
    await initialise_collections()


async def initialise_collections():
    global db_conf_collection
    db_conf_collection = db[config["db_conf_collection"]]

    global flows_collection
    flows_collection = db[config["flows_collection"]]

    global tables_collection
    tables_collection = db[config["tables_collection"]]

    global columns_collection
    columns_collection = db[config["columns_collection"]]

    global transforms_collection
    transforms_collection = db[config["transforms_collection"]]


async def close_db():
    """Close database connection."""
    del db
    client.close()


async def get_db_conf_collection():
    return db_conf_collection


async def get_flows_collection():
    return flows_collection


async def get_tables_collection():
    return tables_collection


async def get_columns_collection():
    return columns_collection


async def get_transforms_collection():
    return transforms_collection