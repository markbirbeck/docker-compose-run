#!/usr/bin/env node
var dcr = require('docker-compose-run');

/**
 * Get the service passed in:
 */

var service = process.argv[2];

/**
 * Modify the command-line arguments to remove the service
 * parameter:
 *
 * TODO(MB): This is not desirable, but has to be done for now since the
 * dcr() function is going to look for parameters at process.argv.slice[2].
 */

process.argv.splice(2, 1);

/**
 * Execute dcr() with the service but no docker-compose.yml path, or
 * app name:
 */

dcr(service);
