see https://github.com/prophittcorey/react-flux-seed

React Flux Seed
===============

A demo application demonstrating the Flux architecture and ReactJS
rendering.

This application does **not** use ES6. Instead, it uses ES5 (the JavaScript most
people are familiar and comfortable with). Additionally, this application makes
use of the following npm packages for its core workflow:

1. `browserify` (keeps JavaScript in modules, requires them as needed)
2. `gulp` (handles development workflow tasks)

Requirements
------------

1. `git`
2. `npm`

Setup
-----

1. `git clone https://github.com/prophittcorey/react-flux-seed`
2. `cd react-flux-seed`
3. `npm install`
4. `gulp`

The first step is to fetch the code with git and hopping into the repositories
root directory. Once inside, run `npm install` to install all dependencies. The
final step is running `gulp` to perform a development build and automatically
start a development server.

There are some additional `gulp` options you can provide for some added
functionality:

1. `gulp --livereload` will begin a development server with live reloading
   enabled.
2. `gulp --production` will begin a production build (minified/uglified)

Notes
-----

If you get an error, 'gulp not found' it means you have not
installed `gulp` globally.

You can use the local version of `gulp` by providing the complete path,
`./node_modules/.bin/gulp`. If this is painful you can globally install `gulp`
via **npm** `npm install -g gulp`.

An alternative solution (and the one I use) is to modify your `$PATH`
environment to look through the local `node_modules/` before any global paths.
You can do this by modifying your `$PATH` variable in your startup script, for
instance my `~/.bashrc` file contains this line:

```bash
export PATH=node_modules/.bin:$PATH
```

License
-------

    The MIT License (MIT)

    Copyright (c) 2015, Corey Prophitt

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to
    deal in the Software without restriction, including without limitation the
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
    IN THE SOFTWARE.
