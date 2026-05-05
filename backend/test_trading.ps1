
$baseUrl = "http://localhost:5454"
$resultsFile = "test_results.txt"

function Log-Test {
    param($name, $status, $details)
    $msg = "[$(Get-Date -Format 'HH:mm:ss')] $name : $status`n$details`n"
    Add-Content -Path $resultsFile -Value $msg
    Write-Host $msg
}

# 1. Signup & Login
$testEmail = "trader_$(Get-Random)@example.com"
$testPassword = "password123"

$signupData = @{ email = $testEmail; password = $testPassword; fullName = "Trader User" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupData -ContentType "application/json"
$jwt = $response.jwt
$headers = @{ Authorization = "Bearer $jwt" }
Log-Test "Trader Signup" "SUCCESS" "Email: $testEmail"

# 2. Deposit 100,000 for trading
Invoke-RestMethod -Uri "$baseUrl/api/wallet/deposit/amount/100000" -Method Put -Headers $headers
$wallet = Invoke-RestMethod -Uri "$baseUrl/api/wallet" -Method Get -Headers $headers
Log-Test "Initial Wallet Balance" "SUCCESS" "Balance: $($wallet.balance)"

# 3. Buy Order (Bitcoin)
# Need to make sure 'bitcoin' exists in DB or can be fetched
$orderData = @{
    coinId = "bitcoin"
    quantity = 0.1
    orderType = "BUY"
} | ConvertTo-Json

try {
    $order = Invoke-RestMethod -Uri "$baseUrl/api/orders/pay" -Method Post -Body $orderData -Headers $headers -ContentType "application/json"
    Log-Test "Place BUY Order" "SUCCESS" "Order ID: $($order.id), Status: $($order.status), Price: $($order.price)"
} catch {
    Log-Test "Place BUY Order" "FAILED" $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Log-Test "Place BUY Order Error Detail" "ERROR" $reader.ReadToEnd()
    }
}

# 4. Check Asset updates
try {
    # Assuming there's an endpoint to get user assets
    $assets = Invoke-RestMethod -Uri "$baseUrl/api/asset" -Method Get -Headers $headers
    Log-Test "Check Assets" "SUCCESS" "Assets found: $($assets.Count)"
} catch {
    Log-Test "Check Assets" "FAILED" $_.Exception.Message
}

# 5. Sell Order
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

# 6. Final Wallet Balance
$finalWallet = Invoke-RestMethod -Uri "$baseUrl/api/wallet" -Method Get -Headers $headers
Log-Test "Final Wallet Balance" "SUCCESS" "Balance: $($finalWallet.balance)"
