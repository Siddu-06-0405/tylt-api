const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Query Parameters
const params = { rows: "200", page: "1" };
const queryParams = new URLSearchParams(params).toString();

// Create the HMAC SHA-256 signature
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(JSON.stringify(params))
  .digest('hex');

// Define headers
const headers = {
  "X-TLP-APIKEY": apiKey,
  "X-TLP-SIGNATURE": signature
};

// Step 1: Fetch pay-in transaction history
const baseUrl = "https://api.tylt.money/transactions/merchant";

axios.get(`${baseUrl}/getPayinTransactionHistory?${queryParams}`, { headers })
  .then(async response => {
    const result = response.data.data.filter(item => item.status !== "Expired");
    console.log(`Total valid rows: ${result.length}`);
    
    // Step 2: Loop through each order and get transactions detail
    for (const item of result) {
      const detailParams = { orderId: item.orderId };
      const detailSignature = crypto
        .createHmac("sha256", apiSecret)
        .update(JSON.stringify(detailParams))
        .digest("hex");

      const detailHeaders = {
        "X-TLP-APIKEY": apiKey,
        "X-TLP-SIGNATURE": detailSignature
      };

      try {
        const detailRes = await axios.get(
          `${baseUrl}/getPayinTransactionInformation?orderId=${item.orderId}`,
          { headers: detailHeaders }
        );

        const txDetail = detailRes.data.data;
        console.log("\n--------------------------------------------------");
        console.log(`Order ID: ${txDetail.orderId}`);
        console.log(`Status: ${txDetail.status}`);
        console.log(`Customer: ${txDetail.customerName || "(none)"}`);
        console.log("Transactions:", JSON.stringify(txDetail.transactions, null, 2));
      } catch (err) {
        console.error(`Error fetching details for ${item.orderId}`, err.message);
      }
    }
  })
  .catch(error => {
    console.error("Error fetching transaction history:", error.message);
  });
