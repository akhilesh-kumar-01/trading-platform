
$baseUrl = "http://localhost:5454"
$resultsFile = "test_results_detailed.txt"

function Log-Test {
    param($name, $status, $details)
    $msg = "[$(Get-Date -Format 'HH:mm:ss')] $name : $status`n$details`n"
    Add-Content -Path $resultsFile -Value $msg
    Write-Host $msg
}

# 1. Signup
$testEmail = "trader_$(Get-Random)@example.com"
$testPassword = "password123"
$signupData = @{ email = $testEmail; password = $testPassword; fullName = "Trader User" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupData -ContentType "application/json"
$jwt = $response.jwt
$headers = @{ Authorization = "Bearer $jwt" }
Log-Test "Trader Signup" "SUCCESS" "Email: $testEmail"

# 2. Deposit
Invoke-RestMethod -Uri "$baseUrl/api/wallet/deposit/amount/100000" -Method Put -Headers $headers
Log-Test "Wallet Deposit" "SUCCESS" "100000"

# 3. Try to get coin details (this might fail due to dummy key, but let's see)
try {
    $coinDetails = Invoke-RestMethod -Uri "$baseUrl/coins/details/bitcoin" -Method Get
    Log-Test "Get Coin Details" "SUCCESS" "Name: $($coinDetails.name)"
} catch {
    Log-Test "Get Coin Details" "FAILED" $_.Exception.Message
}

# 4. Check if bitcoin is in DB via API list (if applicable)
try {
    $coins = Invoke-RestMethod -Uri "$baseUrl/coins?page=1" -Method Get
    Log-Test "List Coins" "SUCCESS" "Count: $($coins.Count)"
} catch {
    Log-Test "List Coins" "FAILED" $_.Exception.Message
}

# 5. Buy Order
$orderData = @{
    coinId = "bitcoin"
    quantity = 0.1
    orderType = "BUY"
} | ConvertTo-Json

try {
    $order = Invoke-RestMethod -Uri "$baseUrl/api/orders/pay" -Method Post -Body $orderData -Headers $headers -ContentType "application/json"
    Log-Test "Place BUY Order" "SUCCESS" "Order ID: $($order.id)"
} catch {
    Log-Test "Place BUY Order" "FAILED" $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Log-Test "Place BUY Order Error Detail" "ERROR" $reader.ReadToEnd()
    }
}

# 6. Check Assets (Fixed endpoint)
try {
    $assets = Invoke-RestMethod -Uri "$baseUrl/api/assets" -Method Get -Headers $headers
    Log-Test "Check Assets" "SUCCESS" "Assets found: $($assets.Count)"
} catch {
    Log-Test "Check Assets" "FAILED" $_.Exception.Message
}
