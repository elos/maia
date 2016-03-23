#!/bin/bash

# This setup.sh file establishes a reasonable javascript development
# environment. It is composed of:
# Assumptions:
#   - you have homebrew (for installing Node)
#   - you have python (for running SimpleHTTPServer)
#
#   1) Installing Node (Using Homebrew)
#   2) Installing (updating) npm using npm
#   3) Installing package deps
set -e


echo "
    Hello, and welcome. This is an elos project.

    JS is a mess. We know, we have tried very hard to
    forget about that. What things do you absolutely
    need to write successful software?

    1) Well-defined language, we are computer scientists we don't work
        with ill-defined structures
    2) Clear build and distribution paths
    3) Testing

    You might be thinking, lol, this is hilarious, because javascript literally has
    none of these. And to that I would respond yes, but forget that. For I have
    waded through the depths in order to deliver this hermetically sealed (as well
    as I know how) package in which you can write formatted, linted (haha why did
    we invent compilers again?), typed javascript code. And you can test it, too!

    --------------------------------------------------------------------------------
"

echo "
    Installing Node using Homebrew

    I think this just won't install if you already have it, if it blows up
    my bad.
"
brew install node

echo "
    Installing npm using npm (really brilliant)
"
npm install npm -g

echo "
    Now we are installing our local dependencies.
    Sorry about the wait. Literally a million
    deps.
"
npm install

echo "
    --------------------------------------------------------------------------------
    Phew! Alright, you know that \`make build\` builds, and \`make test\`
    runs the tests. If you don't write tests the code doesn't work.

    To get started right away, try: \`make run\`. Should fire up a python
    server, navigate to the root of the server it starts (probably localhost:8000)
"
