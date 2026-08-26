$root = Split-Path -Parent $PSScriptRoot
$worker = Join-Path $PSScriptRoot "clean-install-worker.ps1"
Remove-Item (Join-Path $root "npm-install.done") -Force -ErrorAction SilentlyContinue
$process = Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $worker) -WorkingDirectory $root -PassThru
$process.Id | Set-Content (Join-Path $root "npm-install.pid")
Write-Output "Limpeza e instalacao iniciadas com PID $($process.Id)"