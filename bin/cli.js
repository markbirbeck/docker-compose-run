#!/usr/bin/env node
var dcr = require('docker-compose-run');
var commandLineArgs = require('command-line-args');

var optionDefinitions = [
  { name: 'root', defaultValue: process.env.DCR_ROOT },
  { name: 'service', defaultOption: true }
];
var options = commandLineArgs(optionDefinitions);

/**
 * Get the service passed in:
 */

var service = options.service;

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

dcr(service, options.root);
