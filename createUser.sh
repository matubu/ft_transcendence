#!/bin/bash
for (( c=1; c<=1000; c++ ))
do
	TMP={"\"id\"":"$c","\"fullname\"":"\"$c\"","\"twoauth\"":false,"\"img\"":"\"$c\"","\"elo\"":$RANDOM}
	curl -X POST http://localhost:3000/api/users/insert -H \
	"Content-Type: application/json" -d "$TMP"
done