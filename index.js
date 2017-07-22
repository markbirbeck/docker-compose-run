'use strict';

/*
 * Note that we want this to run as widely as possible so we're not using
 * any ES6 features.
 */

var path = require('path');
var spawn = require('child_process').spawn;

/**
 * Execute a Docker Compose 'run' command.
 * @param {string} app name
 * @param {string} path to Docker Compose config file
 */

module.exports = function(app, dcPath) {

  /**
   * The Docker Compose file to use:
   */

  var dcFile = path.join(dcPath, 'docker-compose.yml');

  /**
   * Create the command to run inside the Docker container, which is a
   * combination of the app name and any parameters the user passes in:
   */

  var cmd = [app]
  .concat(process.argv.slice(2))
  .join(' ');

 /**
  * Build the full command that needs to be spawned:
  */

  var command = [
    'docker-compose',
    '-f',
      dcFile,
    'run',
      app,
        cmd
  ].join(' ');

  /**
   * Now spawn the command and send any IO to the right streams:
   */

  spawn(command, {
    stdio: 'inherit',
    shell: true
  });
};
