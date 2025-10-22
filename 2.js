const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const crypto = require('crypto');

// Replace with your API Key and Secret
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Request body
const requestBody = {
  "currency": "INR",
  "payoutRequests": [
    {
      "beneficiary_name": "Jon Doe",
      "beneficiary_account_number": "00001010101010", 
      "beneficiary_IFSC": "IFSC000008",
      "amount": 100,
      "reference_id": "payoutid_12345"
    }
  ]
}

// Convert request body to JSON
const raw = JSON.stringify(requestBody);

// Function to create HMAC SHA-256 signature
const createSignature = (secret, data) => {
    return crypto.createHmac('sha256', secret)
                 .update(data)
                 .digest('hex');
};

// Generate signature
const signature = createSignature(apiSecret, raw);

// Define headers
const headers = {
    "Content-Type": "application/json", // ✅ important
    "X-TLP-APIKEY": apiKey,
    "X-TLP-SIGNATURE": signature
};

// Send the request
axios.post('https://api.tylt.money/fiatPayout/h2h/create', raw, { headers })
    .then(response => console.log("Success:", response.data))
    .catch(error => console.error("Error:", error));
