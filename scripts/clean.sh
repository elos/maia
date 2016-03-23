#!/bin/bash

set -e

echo "
    Cleaning Maia directory

    1) Removing node_modules directory
    2) Removing build directory

    -------------------------------------"

echo "
        * Removing node_modules (rm -rf ./node_modules/*)"
read -p "        --> Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
    rm -rf ./node_modules/*
fi

echo "
    -------------------------------------
    Cleaning Build
        * Removing built css (rm -rf ./build/css/*.css)
        * Removing built js (rm -rf ./build/js/*.js)
        * Removing assets (rm -rf ./build/assets)
        * Removing index.html (rm -f ./build/index.html)"
read -p "        --> Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
    rm -rf ./build/css/*.css
    rm -rf ./build/js/*.js
    rm -rf ./build/assets
    rm -f ./build/index.html
fi
echo "
    -------------------------------------
    Cleaning Distribution
        * Removing built css (rm -rf ./dist/css/*.css)
        * Removing built js (rm -rf ./dist/js/*.js)
        * Removing assets (rm -rf ./dist/assets)
        * Removing index.html (rm -f ./dist/index.html)"
read -p "        --> Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
    # do dangerous stuff
    rm -rf ./dist/css/*.css
    rm -rf ./dist/js/*.js
    rm -rf ./dist/assets
    rm -f ./dist/index.html
fi
