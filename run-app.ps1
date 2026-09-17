Set-Location $PSScriptRoot
Start-Process -FilePath ".\node_modules\electron\dist\electron.exe" -ArgumentList "." -WindowStyle Hidden