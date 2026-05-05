
$baseUrl = "http://localhost:5454"
$resultsFile = "test_results_full.txt"

function Log-Test {
    param($name, $status, $details)
    $msg = "[$(Get-Date -Format 'HH:mm:ss')] $name : $status`n$details`n"
    Add-Content -Path $resultsFile -Value $msg
    Write-Host $msg
}

# 1. Login (using previous email)
$testEmail = "trader_1973364007@example.com"
$testPassword = "password123"
$signinData = @{ email = $testEmail; password = $testPassword } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/signin" -Method Post -Body $signinData -ContentType "application/json"
$jwt = $response.jwt
$headers = @{ Authorization = "Bearer $jwt" }
Log-Test "Login" "SUCCESS" "Email: $testEmail"

# 2. Check current assets
$assets = Invoke-RestMethod -Uri "$baseUrl/api/assets" -Method Get -Headers $headers
Log-Test "Pre-Sell Assets" "SUCCESS" "Count: $($assets.Count)"

# 3. Sell Order (0.05 BTC)
$sellData = @{
    coinId = "bitcoin"
    quantity = 0.05
    orderType = "SELL"
} | ConvertTo-Json

try {
    $sellOrder = Invoke-RestMethod -Uri "$baseUrl/api/orders/pay" -Method Post -Body $sellData -Headers $headers -ContentType "application/json"
    Log-Test "Place SELL Order" "SUCCESS" "Order ID: $($sellOrder.id), Status: $($sellOrder.status)"
} catch {
    Log-Test "Place SELL Order" "FAILED" $_.Exception.Message
}

# 4. Check assets after sell
$assetsAfter = Invoke-RestMethod -Uri "$baseUrl/api/assets" -Method Get -Headers $headers
Log-Test "Post-Sell Assets" "SUCCESS" "Count: $($assetsAfter.Count), Asset[0] Quantity: $($assetsAfter[0].quantity)"

# 5. Final Balance
$wallet = Invoke-RestMethod -Uri "$baseUrl/api/wallet" -Method Get -Headers $headers
Log-Test "Final Wallet Balance" "SUCCESS" "Balance: $($wallet.balance)"
