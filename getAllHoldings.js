// getHoldingsWithBearer.js

require('dotenv').config();
const axios = require('axios');

// Your Tylt access token (from browser, user session, etc)
const bearerToken = process.env.TYLT_TOKEN; // Set this in your .env!

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${bearerToken}`
};

axios.get('https://api.tylt.money/transactions/getAllHoldings', { headers })
  .then(response => {
    console.log("=== Tylt Holdings (Multi-currency Wallet) ===");
    if (response.data && Array.isArray(response.data.data)) {
      response.data.data.forEach((holding, idx) => {
        console.log(
          `[${idx + 1}] ${holding.currencySymbol} - Balance: ${holding.balance} (${holding.currencyImg})`
        );
      });
    } else {
      console.log(JSON.stringify(response.data, null, 2));
    }
  })
  .catch(error => {
    console.error("Error fetching holdings:", error.response ? error.response.data : error.message);
  });
