#!/bin/bash
docker cp initmongo/ duty-designator_mongodb_1:/data
docker exec -t -w /data/initmongo  duty-designator_mongodb_1 mongo localhost/dutyDB drop_chores_and_pioneers.js
docker exec -t -w  /data/initmongo  duty-designator_mongodb_1 mongoimport --type=csv --file=chores.csv --headerline -ddutyDB -cchores
docker exec -t -w  /data/initmongo  duty-designator_mongodb_1 mongoimport --type=csv --file=pioneers.csv --headerline -ddutyDB -cpioneers
docker exec -t duty-designator_mongodb_1 rm -rf /data/initmongo
