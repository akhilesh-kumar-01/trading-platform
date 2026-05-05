$files = Get-ChildItem -Path "c:\PROJECTS\Trading-Platform\Frontend-React\src" -Include *.jsx,*.js,*.css -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    $newContent = $content -replace 'bg-base', 'bg-bg-base'
    $newContent = $newContent -replace 'bg-surface', 'bg-bg-surface'
    $newContent = $newContent -replace 'bg-elevated', 'bg-bg-elevated'
    $newContent = $newContent -replace 'text-primary', 'text-text-primary'
    $newContent = $newContent -replace 'text-secondary', 'text-text-secondary'
    $newContent = $newContent -replace 'text-muted', 'text-text-muted'
    
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated $($file.FullName)"
    }
}
