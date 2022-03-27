#!/bin/bash
MAX=5

echo -en "Check jq "
if [ $(brew list | grep jq) != "jq" ]
then
	brew install jq &> /dev/null
	echo "[installed]"
else
	echo "[ok]"
fi

echo "STEP 1/3"
for (( c=1; c<=$MAX; c++ ))
do
	echo -en "\t Generate FakeUser : $c\\$MAX\r"
	FAKENAME=$(curl --silent https://api.namefake.com/)
	NAME+=($(printf "%s" $FAKENAME | jq .name))
	NICKNAME+=($(printf "%s" $FAKENAME | jq .username))
done

echo -e "\nSTEP 2/3"
for (( c=1; c<=$MAX; c++ ))
do
	echo -en "\t Generate Image : $c\\$MAX\r"
	REQ=$(curl --silent https://aws.random.cat/meow)
	PICTURE+=($(printf "$s\n" $REQ | jq .file))
done

echo -e "\nSTEP 3/3"
for (( c=1; c<=$MAX; c++ ))
do
	echo -en "\t Upload in DataBase : $c\\$MAX\r"
	TMP={"\"id\"":"$(( $RANDOM + 10000 ))","\"fullname\"":"${NAME[$c - 1]}","\"nickname\"":"${NICKNAME[$c - 1]}","\"twoauth\"":false,"\"img\"":"${PICTURE[$c - 1]}","\"elo\"":$RANDOM}
	curl -X POST http://localhost:3000/api/users/insert -H "Content-Type: application/json" -d "$TMP"
done

echo -e "\ndone."
