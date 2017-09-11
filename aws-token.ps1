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
Invoke-Expression "npm start -- $args";
