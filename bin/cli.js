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
 * Execute dcr() with the service and whatever docker-compose.yml path is
 * set in the DCR_ROOT environment variable. Note that there is no app
 * name:
 */

dcr(service, process.env.DCR_ROOT);
