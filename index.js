'use strict';

/*
 * Note that we want this to run as widely as possible so we're not using
 * any ES6 features.
 */

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var verbose = false;

function addFileIfExists(fileName, command) {
  try {
    fs.accessSync(fileName, fs.constants.R_OK);
    command.push('-f', fileName);
  } catch(e) {
    if (verbose) console.log('No ' + fileName + ' file found');
  }
}

/**
 * Execute a Docker Compose 'run' command.
 * @param {string} service name
 * @param {string} path to Docker Compose config file
 * @param {string} app name
 */

module.exports = function(service, dcPath, app) {

  /**
   * The Docker Compose file to use (if specified):
   */

  var dcFile = (!dcPath)
    ? undefined
    : path.join(dcPath, 'docker-compose.yml');

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
   * If there's a Docker Compose file specified then add it as a
   * parameter:
   */

  if (dcFile) command.push('-f', dcFile);

  /**
   * If there is no file specified then Docker Compose will just automatically
   * pick up 'docker-compose.yml' in the current directory. However, if we
   * want to add other files like 'docker-compose.dcr.yml' then we'll need to
   * add the 'docker-compose.yml' file explicitly:
   */

  else {

    /**
     * Docker Compose applies these files in the order that they are specified
     * on the command line, so we put the file with the same name as the environment
     * last, and that allows us to override everything:
     */

    [
      'docker-compose.yml',
      'docker-compose.dcr.yml',
      'docker-compose.' + service + '.yml',
      'docker-compose.' + process.env.DCR_ENVIRONMENT + '.yml'
    ].map(function(fileName) {
      addFileIfExists(fileName, command);
    });
  }

  /**
   * Add the instructions to run the service with the default options:
   */

  command.push('run', '--service-ports', '--rm', service);

  /**
   * If there is a command to pass to the container then add it:
   */

  if (cmd) command.push(cmd);

  command = command.join(' ');

  /**
   * Now spawn the command and send any IO to the right streams:
   */

  spawn(command, {
    stdio: 'inherit',
    shell: true
  });
};
