const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const crypto = require('crypto');

// Replace with your API Key and Secret
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Create query parameters (if any)
const queryParams = '{}';

// Create the HMAC SHA-256 signature
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(queryParams)
  .digest('hex');

// Define headers
const headers = {
  "X-TLP-APIKEY": apiKey,
  "X-TLP-SIGNATURE": signature
};

// Send the GET request
axios.get("https://api.tylt.money/transactions/merchant/getAccountBalance", { headers })
  .then(response => {
    console.log("Response:", response.data);
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });

