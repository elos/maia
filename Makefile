# ELOS MAKEFILE
# COMMANDS:


# I think the way make work it will associate recipes (what I think the
# (name:) things are with targets. but that's not how I've been using them
# so I just declar them all "phony"
.PHONY: build build-main build-vendor run test setup clean

# MAIA_BUILD_DIR is the directory to build the app to for development and
# serving locally. Note you can do something like `make run MAIA_BUILD_DIR=/some/dir`
# to customize this
MAIA_BUILD_DIR?=./build

# MAIA_DIST_DIR is the directory that the prod version should be build to
# use like: `make dist MAIA_DIST_DIR=/some/dir`
MAIA_DIST_DIR?=./dist

# This is the browserify stuff, you add external deps to the requires (after adding them to package.json, and installing them).
# Basically tells browserify to require these is our vendors.js file. Then the externals is our app's declaration for browserify
# of everything that should be bundled externally
# TODO: consider adding momentjs
requires  = -r ./node_modules/react -r ./node_modules/react-dom -r ./node_modules/flux -r ./node_modules/object-assign -r ./node_modules/events -r ./node_modules/react-tap-event-plugin -r ./node_modules/material-ui -r ./node_modules/immutable -r ./node_modules/react-addons-transition-group
externals = -x ./node_modules/react -x ./node_modules/react-dom -x ./node_modules/flux -x ./node_modules/object-assign -x ./node_modules/events -x ./node_modules/react-tap-event-plugin -x ./node_modules/material-ui -x ./node_modules/immutable -x ./node_modules/react-addons-transition-group

mainBuild = --entry ./app/js/main.js $(externals) --transform [ babelify --presets [ es2015 react ] ] --outfile $(MAIA_BUILD_DIR)/js/main.js
vendBuild = $(requires) --outfile $(MAIA_BUILD_DIR)/js/vendors.js


# Build the js main and vendor files
# Not a production build!!!!
build:
	echo "Building main.js & vendor.js NOT PRODUCTION"
	make build-main && make build-vendor

# Build the js main file
# This is not a production build, not the debug
build-main:
	browserify $(mainBuild) --debug --verbose

# Build the vendor main file
# This is not the production build
build-vendor:
	browserify $(vendBuild) --debug --verbose

run:
	make build && cd build && python -m SimpleHTTPServer

test:
	npm test

# ---- UTILITIES ----

setup:
	./scripts/setup.sh
clean:
	./scripts/clean.sh
