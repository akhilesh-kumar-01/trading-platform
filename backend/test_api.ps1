
$baseUrl = "http://localhost:5454"
$resultsFile = "test_results.txt"

function Log-Test {
    param($name, $status, $details)
    $msg = "[$(Get-Date -Format 'HH:mm:ss')] $name : $status`n$details`n"
    Add-Content -Path $resultsFile -Value $msg
    Write-Host $msg
}

# 1. Signup
$signupData = @{
    email = "testuser_$(Get-Random)@example.com"
    password = "password123"
    fullName = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupData -ContentType "application/json"
    $jwt = $response.jwt
    Log-Test "Signup" "SUCCESS" "JWT: $jwt"
} catch {
    Log-Test "Signup" "FAILED" $_.Exception.Message
    exit
}

# 2. Signin (Invalid)
$signinDataInvalid = @{
    email = "nonexistent@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "$baseUrl/auth/signin" -Method Post -Body $signinDataInvalid -ContentType "application/json"
    Log-Test "Signin (Invalid)" "FAILED" "Should have failed with invalid credentials"
} catch {
    Log-Test "Signin (Invalid)" "SUCCESS" "Caught expected error: $($_.Exception.Message)"
}

# 3. Signin (Valid)
$signinDataValid = @{
    email = $signupData.email # This is a bit tricky in PS because I didn't store it as a variable
    # Wait, let's fix the signup data usage
}
# Redefining for clarity
$testEmail = "testuser_$(Get-Random)@example.com"
$testPassword = "password123"

$signupData = @{
    email = $testEmail
    password = $testPassword
    fullName = "Test User"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body $signupData -ContentType "application/json"
$jwt = $response.jwt
Log-Test "Signup (Real)" "SUCCESS" "Email: $testEmail"

$signinData = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signin" -Method Post -Body $signinData -ContentType "application/json"
    $loginJwt = $loginResponse.jwt
    Log-Test "Signin (Valid)" "SUCCESS" "JWT received: $loginJwt"
} catch {
    Log-Test "Signin (Valid)" "FAILED" $_.Exception.Message
}

# 4. Fetch Wallet (Initial)
$headers = @{ Authorization = "Bearer $jwt" }
try {
    $wallet = Invoke-RestMethod -Uri "$baseUrl/api/wallet" -Method Get -Headers $headers
    Log-Test "Fetch Wallet" "SUCCESS" "Balance: $($wallet.balance)"
} catch {
    Log-Test "Fetch Wallet" "FAILED" $_.Exception.Message
}

# 5. Deposit Money
try {
    $depositResponse = Invoke-RestMethod -Uri "$baseUrl/api/wallet/deposit/amount/1000" -Method Put -Headers $headers
    $updatedWallet = Invoke-RestMethod -Uri "$baseUrl/api/wallet" -Method Get -Headers $headers
    Log-Test "Deposit Money" "SUCCESS" "New Balance: $($updatedWallet.balance)"
} catch {
    Log-Test "Deposit Money" "FAILED" $_.Exception.Message
}

# 6. Protected Route Access (User Profile)
try {
    $profile = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" -Method Get -Headers $headers
    Log-Test "User Profile" "SUCCESS" "Email: $($profile.email)"
} catch {
    Log-Test "User Profile" "FAILED" $_.Exception.Message
}
