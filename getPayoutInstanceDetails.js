// 2.js

require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// Replace with your payout instance's requestId
const requestId = "753bacea-78ea-4470-b8c4-3fe1cafaca22"; // from your previous API result

const params = { requestId };
const queryString = new URLSearchParams(params).toString();
const url = `https://api.tylt.money/fiatPayout/h2h/getPayoutInstanceDetails?${queryString}`;

const apiKey = process.env.API_KEY;
const secretKey = process.env.API_SECRET;

const signaturePayload = JSON.stringify(params);
const signature = crypto
  .createHmac('sha256', secretKey)
  .update(signaturePayload)
  .digest('hex');

const headers = {
  "Content-Type": "application/json",
  "X-TLP-APIKEY": apiKey,
  "X-TLP-SIGNATURE": signature
};

axios.get(url, { headers })
  .then((response) => {
    console.log("=== Payout Instance Details ===");
    console.log(JSON.stringify(response.data, null, 2));
    // If you want to print details of each payout request (beneficiary), do:
    if (response.data && response.data.data && response.data.data.payoutRequests) {
      response.data.data.payoutRequests.forEach(req => {
        console.log("Beneficiary Payout Request:", req);
      });
    }
  })
  .catch((error) => {
    console.error("Error:", error.response ? error.response.data : error.message);
  });
