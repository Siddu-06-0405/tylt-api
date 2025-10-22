const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const crypto = require('crypto');

// Replace with your API Key and Secret
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Query Parameters
const params = {"rows":"20","page":"1"};
const queryParams = new URLSearchParams(params).toString();

// Create the HMAC SHA-256 signature
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update( JSON.stringify(params) )
  .digest('hex');

// Define headers
const headers = {
  "X-TLP-APIKEY": apiKey,
  "X-TLP-SIGNATURE": signature
};

// Send the GET request
axios.get(`https://api.tylt.money/transactions/merchant/getPayinTransactionHistory?${queryParams}`, { headers })
  .then(response => {
    console.log("Response:", response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
