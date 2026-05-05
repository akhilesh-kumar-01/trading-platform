$files = Get-ChildItem -Path "c:\PROJECTS\Trading-Platform\Frontend-React\src" -Include *.jsx,*.js,*.css -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $newContent = $content -replace 'bg-bg-bg-', 'bg-bg-'
    $newContent = $newContent -replace 'text-text-text-', 'text-text-'
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Cleaned $($file.FullName)"
    }
}
