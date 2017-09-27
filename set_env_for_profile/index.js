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
    help: 'Profile name that the AWS credentials environment variables should be set to. ' ,
	required: true
  });
  return parser.parseArgs();
}


console.log('Set AWS Environment Variables to Profile\n'.green.bold);

let args = parseArgs();

console.log('\n\n----------------------------------------------------------------');
console.log('profile selected: ' +
  '%s'.green.bold, args.profile);
console.log('----------------------------------------------------------------\n\n');


var awscred = require('awscred');

awscred.loadCredentialsFromIniFile({profile: args.profile}, function(err, data) {
  if (err) throw err;

  console.log('***');
  console.log(data);
  // { accessKeyId: 'ABC',
  //   secretAccessKey: 'DEF',
  //   sessionToken: 'GHI',
  //   expiration: Sat Apr 25 2015 01:16:01 GMT+0000 (UTC) }

  console.log(data.region);
  // us-east-1
	console.log('***');
});
//console.log(awscred.loadProfileFromIniFileSync({profile: args.profile}));


// us-east-1 


