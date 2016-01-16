#!/bin/bash

curl http://mtgjson.com/json/AllSets-x.json.zip > card-data.zip
unzip card-data.zip
mv AllSets-x.json card-data.json
rm -rf card-data.zip
