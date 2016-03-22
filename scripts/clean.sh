#!/bin/bash

set -e

echo "Removing node_modules"
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
    rm -rf ./node_modules
fi
