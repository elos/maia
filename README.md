Maia
====

Maia is the elos web app.

```bash
    git clone https://github.com/elos/maia
    make setup
```

#### Directory Structure
```
.
├── Makefile       <- See: make setup, make build, make test, make run, and make gaia
├── README.md      <- This file
├── app            <- The source of the application
├── build          <- The location of development builds
├── dist           <- The location of distribution builds
├── node_modules   <- The location of the node_modules, which are the deps declared by the package.json
├── package.json   <- The npm package.json file which declares dependencies and other trivialities
├── scripts        <- The majority of scripts live here, most should be invoked using make
└── tmp            <- Temp files, primarily for running the gaia integration (see make gaia)
```

#### Decisions

Maia uses ES6 transpiled to ES5 using Babel. Maia also uses React to manage the DOM. Maia uses the browserify module loader to simulate to ability to write "packages" in javascript.

-----------------
For original inspiration see: https://github.com/prophittcorey/react-flux-seed
