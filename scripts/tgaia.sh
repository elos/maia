#!/bin/bash

# this starts up a fully integrated gaia server, that serves the app
# I don't use this too much #betasoftware

echo "
    Starting a provisional Gaia server [BETA]

    It is running on an in-memory DB

    ----------------------------------
"

if [ -e ./tmp/g-server.pid ]; then
    echo " * Found server running...killing old server"
    kill $(cat ./tmp/g-server.pid);
    rm ./tmp/g-server.pid
else
    echo " * Fond no server running...proceeding"
fi

./scripts/gaia --port=8765 --dbtype=mem --appdir=./build > ./tmp/g-stdout.text 2> ./tmp/g-stderr.txt &
echo $! > ./tmp/g-server.pid
echo "
    ---------------------------------
    Server started on 0.0.0.0:8765

    The pid of the running process is in ./tmp/g-server.pid

    To see the logs, do \`tail -f ./tmp/g-stderr.txt\`
"
