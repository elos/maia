#!/bin/bash

# build.sh is intended to be run using `make build`.
# This script in turn calls for the js, css, and assets
# to be build using the `make build-js`, `make build-css`
# `make copy-html` and `make copy-assets`

set -e

echo "
    Building Development

    * \"Compiling\" JS    (make build-js)
    * \"Compiling\" CSS   (make build-css)
    * Copying Assets      (make copy-html)
    * Copying index.html  (make copy-assets)
    -------------------------------"

make build-js MAIA_BUILD_DIR=./build
make build-css MAIA_BUILD_DIR=./build
make copy-html MAIA_BUILD_DIR=./build
make copy-assets MAIA_BUILD_DIR=./build
