#!/usr/bin/env powershell
param (
  [switch] $NpmInstall,
  [switch] $Debug
)
if ( $NpmInstall.IsPresent ) {
  Invoke-Expression "npm install";
}
if ( $Debug.IsPresent ) {
  $ENV:DEBUG = 1;
}
$myargs = $args | % {if ($_ -match '\s') {'"' + $_ + '"'} else { $_} }
$arg_string = $myargs -join " "
#Invoke-Expression "npm start $arg_string"
Invoke-Expression "node src/index.js $arg_string"
