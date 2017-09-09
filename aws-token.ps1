#!/usr/bin/env powershell
param (
  [switch] $NpmInstall
)
if ( $NpmInstall.IsPresent ) {
  Invoke-Expression "npm install";
}
Invoke-Expression "npm start -- $args";
