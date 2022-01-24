param (
  [string] $username,
  [string] $password,
  [string] $hostname,
  [string] $buildVersion,
  [string] $buildNumber
)

# This gets the name of the current Git branch.
$branch = "%teamcity.build.branch%"

# Sometimes the branch will be a full path, e.g., 'refs/heads/master'.
# If so we'll base our logic just on the last part.
if ($branch.Contains("/")) {
  $branch = $branch.substring($branch.lastIndexOf("/")).trim("/")
}

Write-Host "Branch: $branch"

Write-Host "Build version: $buildVersion.$buildNumber"

Write-Host "##teamcity[buildNumber '$buildVersion.$buildNumber']"

Write-Host "Compressing artifacts..."

$ProgressPreference = 'SilentlyContinue'

Compress-Archive -CompressionLevel Fastest .\artifacts\output\* .\artifacts\output.zip

$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $password)))
$userAgent = "powershell/1.0"

Invoke-RestMethod -Uri "https://$hostname.scm.azurewebsites.net/api/zipdeploy?isAsync=true" -Headers @{Authorization = "Basic $base64AuthInfo" } -UserAgent $userAgent -Method POST -InFile ".\artifacts\output.zip" -ContentType "application/zip"

Write-Host "Azure website deployed"

Write-Host "Cleaning up..."

Remove-Item -Path ".\artifacts" -Recurse -Force
