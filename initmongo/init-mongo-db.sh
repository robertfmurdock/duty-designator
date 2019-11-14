#!/bin/bash
mongod --fork --logpath /mongodb.log
#mongo localhost/dutyDB dropdb.js
mongo localhost/dutyDB drop_chores_and_pioneers.js
mongoimport --type=csv --file=chores.csv --headerline -ddutyDB -cchores
mongoimport --type=csv --file=pioneers.csv --headerline -ddutyDB -cpioneers
mongo fsync.js
