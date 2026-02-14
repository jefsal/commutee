# Use this if "npm" is not recognized. Runs npm from Node.js install path.
$npm = "C:\Program Files\nodejs\npm.cmd"
if (-not (Test-Path $npm)) {
    Write-Host "Node.js not found at $npm. Please install from https://nodejs.org"
    exit 1
}
& $npm @args
