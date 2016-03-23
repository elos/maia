#!/bin/bash

set -e

echo "
    Building Development

    * \"Compiling\" JS
    * \"Compiling\" CSS
    * \"Copying\" Assets
    * \"Copying\" index.html
    -------------------------------"

make build-js MAIA_BUILD_DIR=./build
make build-css MAIA_BUILD_DIR=./build
make copy-html MAIA_BUILD_DIR=./build
make copy-assets MAIA_BUILD_DIR=./build
