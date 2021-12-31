import uvicorn

from peltapi.api import app

uvicorn.run("peltapi.api:app", host="0.0.0.0", port=8321, reload=False)


# from peltapi.sql import compile_flow
# from asyncio import run

# run(compile_flow.test_compile_flow())
