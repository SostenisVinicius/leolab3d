$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
& npm.cmd install --no-audit --no-fund *> "npm-install.log"
if ($LASTEXITCODE -eq 0) { "SUCCESS" | Set-Content "npm-install.done" } else { "FAILED" | Set-Content "npm-install.done" }