const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const crypto = require('crypto');

// API credentials
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Request payload
const requestBody = {
  merchantOrderId: "order12345",
  baseAmount: "1",
  baseCurrency: "USDT",
  settledCurrency: "USDT",
  networkSymbol: "BSC",
  callBackUrl: "https://www.test.com/callback",
  customerName: "TradingLeagues",
  comments: "Description testing"
};

// Convert to compact JSON
const rawPayload = JSON.stringify(requestBody);

// Create signature
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(rawPayload)
  .digest('hex');

// Define headers (Content-Type is mandatory)
const headers = {
  "Content-Type": "application/json",
  "X-TLP-APIKEY": apiKey,
  "X-TLP-SIGNATURE": signature
};

// Send POST request
axios.post(
  "https://api.tylt.money/transactions/merchant/createPayinRequest",
  rawPayload,
  { headers }
)
.then(res => {
  console.log("Success:", res.data);
})
.catch(err => {
  console.error("Error:", err.response ? err.response.data : err.message);
});
