$root = Split-Path -Parent $PSScriptRoot
$stdout = Join-Path $root "server.log"
$stderr = Join-Path $root "server.err"
$process = Start-Process -FilePath "npm.cmd" -ArgumentList @("run", "start", "--", "-p", "3100") -WorkingDirectory $root -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru
$process.Id | Set-Content (Join-Path $root "server.pid")
Write-Output "Servidor iniciado com PID $($process.Id)"