$root = Split-Path -Parent $PSScriptRoot
$worker = Join-Path $PSScriptRoot "build-worker.ps1"
Remove-Item (Join-Path $root "build.done") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $root "build.log") -Force -ErrorAction SilentlyContinue
$process = Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $worker) -WorkingDirectory $root -PassThru
$process.Id | Set-Content (Join-Path $root "build.pid")
Write-Output "Build iniciado com PID $($process.Id)"