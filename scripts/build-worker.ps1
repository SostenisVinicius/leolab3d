$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
& npm.cmd run build *> "build.log"
if ($LASTEXITCODE -eq 0) { "SUCCESS" | Set-Content "build.done" } else { "FAILED" | Set-Content "build.done" }