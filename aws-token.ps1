#!/usr/bin/env powershell

Invoke-Expression "npm install";
Invoke-Expression "node src/index.js $argumentList";
