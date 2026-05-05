
$files = Get-ChildItem -Recurse -File -Include *.jsx,*.js,*.css
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace "Treading", "Trading" `
                           -replace "treading", "trading" `
                           -replace "Portfilio", "Portfolio" `
                           -replace "portfilio", "portfolio" `
                           -replace "Transer", "Transfer" `
                           -replace "transer", "transfer" `
                           -replace "TREAD", "TRADE"
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.FullName)"
    }
}
