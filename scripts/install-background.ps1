$root = Split-Path -Parent $PSScriptRoot
$stdout = Join-Path $root "npm-install.log"
$stderr = Join-Path $root "npm-install.err"
$pidFile = Join-Path $root "npm-install.pid"
$process = Start-Process -FilePath "npm.cmd" -ArgumentList @("install", "--no-audit", "--no-fund") -WorkingDirectory $root -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
$process.Id | Set-Content $pidFile
Write-Output "Instalacao iniciada com PID $($process.Id)"