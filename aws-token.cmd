@echo off
:: ensure all the packages are installed first
npm install
:: run the node app
node src/index.js %*
