# ELOS MAKEFILE
# COMMANDS:
#
MAIA_BUILD_DIR?=./build
externals = -x ./node_modules/react -x ./node_modules/react-dom -x ./node_modules/flux -x ./node_modules/object-assign -x ./node_modules/events -x ./node_modules/react-tap-event-plugin -x ./node_modules/material-ui -x ./node_modules/immutable -x ./node_modules/react-addons-transition-group
requires  = -r ./node_modules/react -r ./node_modules/react-dom -r ./node_modules/flux -r ./node_modules/object-assign -r ./node_modules/events -r ./node_modules/react-tap-event-plugin -r ./node_modules/material-ui -r ./node_modules/immutable -r ./node_modules/react-addons-transition-group

.PHONY: build build-main build-vendor run test setup clean

build:
	make build-main && make build-vendor
build-main:
	browserify --debug --entry ./app/js/main.js $(externals) --transform [ babelify --presets [ es2015 react ] ] --outfile $(MAIA_BUILD_DIR)/js/main.js
build-vendor:
	browserify --debug $(requires) --outfile $(MAIA_BUILD_DIR)/js/vendors.js
run:
	make build && python -m SimpleHTTPServer
test:
	npm test

setup:
	./scripts/setup.sh
clean:
	./scripts/clean.sh
