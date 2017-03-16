Write-Host "==========================="
$message = (Get-Item Env:\BUILD_SOURCEVERSIONMESSAGE)
Write-Host $message
if ($message -match 'Not4CI') {
    write-host "The Job exit by signing as Not4CI in the commit"
    exit '1'
}
Write-Host "==========================="