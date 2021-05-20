import uvicorn

from peltapi.api import app


uvicorn.run(app, host="0.0.0.0", port=8321)
