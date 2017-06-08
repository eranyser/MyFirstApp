$url = "http://freeze:Algotec123@git-srv:8080/tfs/DefaultCollection/scm/_git"
$repo = "ci"
$branch = "gen-7"
$dest = "c:\git-repos\scm"

$dir_exist = Test-Path $dest\$repo\.git
if (!$dir_exist)
{
   Write-Host "Cloning $branch into $dest\$repo"
   New-Item -ItemType directory -Path $dest
   Set-Location -Path $dest
   $command = "cmd.exe /C git clone -b $branch $url\$repo"
   Invoke-Expression -Command:$command
}
else
{
   Write-Host "Pulling $branch into $dest\$repo"
   Set-Location -Path $dest\$repo
   $command = "cmd.exe /C git checkout $branch"
   Invoke-Expression -Command:$command
   $command = "cmd.exe /C git pull origin"
   Invoke-Expression -Command:$command
}