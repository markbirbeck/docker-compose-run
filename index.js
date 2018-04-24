'use strict';

/*
 * Note that we want this to run as widely as possible so we're not using
 * any ES6 features.
 */

var path = require('path');
var spawn = require('child_process').spawn;

/**
 * Execute a Docker Compose 'run' command.
 * @param {string} service name
 * @param {string} path to Docker Compose config file
 * @param {string} app name
 */

module.exports = function(service, dcPath, app) {

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

  var command = [];

  command.push('docker-compose');

  /**
   * Add the Docker Compose file to use:
   */

  command.push('-f', dcFile);

  /**
   * Add the instructions to run the service with the default options:
   */

  command.push('run', '--service-ports', '--rm', service);

  /**
   * Add the command to pass to the container:
   */

  command.push(cmd);

  command = command.join(' ');

  /**
   * Now spawn the command and send any IO to the right streams:
   */

  spawn(command, {
    stdio: 'inherit',
    shell: true
  });
};
