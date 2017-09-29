'use strict';

/* eslint no-console: 0 */

const ArgumentParser = require('argparse').ArgumentParser;
const AWS = require('aws-sdk');
//const os = require('os');
//const fs = require('fs');
//const ini = require('ini');
//const path = require('path');
const pkg = require('../package.json');
require('colors');


function parseArgs(providerName) {
  let parser = new ArgumentParser({
    addHelp: true,
    description: pkg.description,
    version: pkg.version
  });
  parser.addArgument(['--profile'], {
    help: 'Profile name that the AWS credentials environment variables should be set to. ',
	required: true
  });
  parser.addArgument(['command'], {
    help: 'The path to the command to run',
	//required: true,
	nargs: 1
  });
  return parser.parseArgs();
}


console.log('Set AWS Environment Variables to Profile\n'.green.bold);

let args = parseArgs();

console.log('\n\n----------------------------------------------------------------');
console.log('profile selected: ' +
  '%s'.green.bold, args.profile);
console.log('Command to run: ' +
  '%s'.green.bold, args.command);
console.log('----------------------------------------------------------------\n\n');


var awscred = require('awscred');

awscred.loadCredentialsFromIniFile({profile: args.profile}, function(err, data) {
  if (err) throw err;

  console.log('***');
  console.log(data);
  if(data.sessionToken) process.env.AWS_SESSION_TOKEN = data.sessionToken;
  if(data.secretAccessKey) process.env.AWS_SECRET_ACCESS_KEY = data.secretAccessKey;
  if(data.accessKeyId) process.env.AWS_ACCESS_KEY_ID = data.accessKeyId;


  // { accessKeyId: 'ABC',
  //   secretAccessKey: 'DEF',
  //   sessionToken: 'GHI',
  //   expiration: Sat Apr 25 2015 01:16:01 GMT+0000 (UTC) }
  //
  var exec = require('child_process').exec;
  exec(args.command, function(error, stdout, stderr) {
    // command output is in stdout
  });

});


