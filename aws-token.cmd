@echo off
powershell -File "./aws-token.ps1" -ExecutionPolicy ByPass -NoLogo -NoProfile -ArgumentList %*
