#!/bin/bash

# reset.sh should be run as `make reset. It calls
# the `make clean` and `make setup` commands.
# Use this to check that a fresh install works, good to see
# that there isn't anything idosyncratic or special about your
# local env. this tries to establish that. also good for starting
# over if you messed with your env

set -e

echo "
    Resetting your environment.
    ---------------------------------
"
echo "
     * First running make clean
"
make clean

echo "
     * Second running make setup
"
make setup
