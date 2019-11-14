#!/bin/bash
mongod --fork --logpath mongodb.log
mongo drop-dutyDB.js
mongoimport --type=csv --file=chores.csv --headerline -ddutyDB -cchores
mongoimport --type=csv --file=pioneers.csv --headerline -ddutyDB -cpioneers
mongo fsync.js
