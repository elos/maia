#!/bin/bash

if [ -e g-server.pid ]; then
    echo "Killing old server"
    kill $(cat g-server.pid);
    rm g-server.pid
else
    echo "No server running"
fi

./gaia --port=8765 --dbtype=mem --appdir=./build > ./g-stdout.text 2> g-stderr.txt &
echo "Writing pid file"
echo $! > ./g-server.pid
echo "Gaia test server started"
