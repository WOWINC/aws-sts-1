@echo off
:: it is important that no additional args are after the file. those will be passed to the script as args
powershell -ExecutionPolicy ByPass -NoLogo -NoProfile -File "./aws-token.ps1" %*
