#!/bin/bash
MAX=10

echo -en "Check jq "
if [ $(brew list | grep jq) != "jq" ]
then
	echo "Install jq please"
	exit
else
	echo "[ok]"
fi

echo "STEP 1/3"
if [ ! -f ./fakeuser.json ]
then
	echo "[" > fakeuser.json
	for (( c=1; c<=$MAX; c++ ))
	do
		if (( c!=1 ))
		then
			echo "," >> fakeuser.json
		fi
		echo -en "\t Generate FakeUser : $c\\$MAX\r"
		FAKENAME=$(curl --silent https://api.namefake.com/ --insecure)
		echo $FAKENAME >> fakeuser.json
		NAME+=($(printf "%s" $FAKENAME | jq .name))
		NICKNAME+=($(printf "%s" $FAKENAME | jq .username))
	done
	echo "]" >> fakeuser.json
else
	echo "[ok]"
fi

echo -e "\nSTEP 2/3"
if [ ! -f ./image.json ]
then
	echo "[" > image.json
	for (( c=1; c<=$MAX; c++ ))
	do
		if (( c!=1 ))
		then
			echo "," >> image.json
		fi
		echo -en "\t Generate Image : $c\\$MAX\r"
		REQ=$(curl --silent https://aws.random.cat/meow)
		echo $REQ >> image.json
		PICTURE+=($(echo $REQ | jq .file))
	done
	echo "]" >> image.json
else
	echo "[ok]"
fi

echo -e "\nSTEP 3/3"
for (( c=1; c<=$MAX; c++ ))
do
	echo -en "\t Upload in DataBase : $c\\$MAX\r"
	NAME=$(cat ./fakeuser.json | jq .[$c-1].name)
	NICKNAME=$(cat ./fakeuser.json | jq .[$c-1].username)
	PICTURE=$(cat image.json | jq ".[$c-1].file")
	TMP={"\"id\"":"$(( $RANDOM + 10000 ))","\"fullname\"":"$NAME","\"nickname\"":"$NICKNAME","\"twoauth\"":false,"\"img\"":"$PICTURE","\"elo\"":$RANDOM}
	curl -X POST http://localhost:3000/api/users/insert -H "Content-Type: application/json" -d "$TMP"
done

echo -e "\ndone."
