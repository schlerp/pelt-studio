import hjson

# load config
with open("./config.json") as f:
    config = hjson.load(f)
