docker-compose-run
==================

This module executes Docker Compose 'run' commands using specific Docker Compose configuration files. The idea is to be able to capture the detail of a particular application and how it should be run, in simple, shareable files.

For an explanation of the thinking behind this module see the blog post [Disposable Laptops With Docker Compose And NPM](http://bit.ly/2tBCYHB).

## Example

An example would be to create a way to run Jekyll commands without having to install Jekyll on our desktop.

First create a `docker-compose.yml` file that describes how to run the Jekyll command, and how to make it accessible to the desktop:

```yaml
version: "2"
services:
  jekyll:
    image: jekyll/jekyll
    ports:
    - "4000:4000"
    volumes:
    - ${PWD}:/srv/jekyll
```

Then create a shell script that uses this module; it could be called anything, but we'll call it `dcr-jekyll.js`:

```javascript
#!/usr/bin/env node
var dcr = require('docker-compose-run');

dcr('jekyll', __dirname, 'jekyll'));
```

Now when we run this script with a Jekyll command, a Docker container will be created and launched, and our command will be passed in to it:

```shell
$ ./dcr-jekyll --help
jekyll 3.4.3 -- Jekyll is a blog-aware, static site generator in Ruby

Usage:

  jekyll <subcommand> [options]

Options:
        -s, --source [DIR]  Source directory (defaults to ./)
        -d, --destination [DIR]  Destination directory (defaults to ./_site)
            --safe         Safe mode (defaults to false)
        -p, --plugins PLUGINS_DIR1[,PLUGINS_DIR2[,...]]  Plugins directory (defaults to ./_plugins)
            --layouts DIR  Layouts directory (defaults to ./_layouts)
            --profile      Generate a Liquid rendering profile
        -h, --help         Show this message
        -v, --version      Print the name and version
        -t, --trace        Show the full backtrace when an error occurs

Subcommands:
  import
  build, b              Build your site
  clean                 Clean the site (removes site output and metadata file) without building.
  doctor, hyde          Search site and print specific deprecation warnings
  help                  Show the help message, optionally for a given subcommand.
  new                   Creates a new Jekyll site scaffold in PATH
  new-theme             Creates a new Jekyll theme scaffold
  serve, server, s      Serve your site locally
  docs, d               Start a local server for the Jekyll documentation
```

## API

The module provides a single function that takes three parameters:

* the name of the service to run, and;
* the directory in which the `docker-compose.yml` file is located, and;
* the name of the application to run.

The service name must match the key in the Docker Compose file. The application parameter is the name of the command to run _within_ the Docker container.

Note that the application name can be omitted if the Docker image has been set up in such a way that it's not needed. This will be the case if the `ENTRYPOINT` has been set in the `Dockerfile`.
