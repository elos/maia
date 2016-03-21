# ELOS MAKEFILE
# COMMANDS:

vendors = ./node_modules/react ./node_modules/react-dom ./node_modules/flux ./node_modules/object-assign ./node_modules/events ./node_modules/react-tap-event-plugin ./node_modules/material-ui ./node_modules/immutable ./node_modules/react-addons-transition-group

build:
	make build-main && make build-vendor
build-main:
	browserify --debug --entry ./app/js/main.js --external $(vendors) --outfile bundle.js --transform [ babelify --presets [ es2015 react ] ]
build-vendor:
	browserify --debug --require $(vendors) --outfile vendors.js
run:
	make build && python -m SimpleHTTPServer
test:
	npm test
