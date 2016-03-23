#!/bin/bash

set -e

echo "
    First running make clean
"
make clean

echo "
    Second running make setup
"
make setup
