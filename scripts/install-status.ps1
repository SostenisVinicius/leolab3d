$root = Split-Path -Parent $PSScriptRoot
$done = Join-Path $root "npm-install.done"
$pidFile = Join-Path $root "npm-install.pid"
if (Test-Path $done) { Get-Content $done; exit }
if (Test-Path $pidFile) {
  $processId = [int](Get-Content $pidFile)
  if (Get-Process -Id $processId -ErrorAction SilentlyContinue) { "RUNNING:$processId" } else { "STOPPED_WITHOUT_MARKER:$processId" }
} else { "NO_PID" }