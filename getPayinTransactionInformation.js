const dotenv = require('dotenv');
dotenv.config();

const axios = require('axios');
const crypto = require('crypto');

const apiKey = process.env.API_KEY;
const secretKey = process.env.API_SECRET;

const params = {
  orderId: '3fb60350-aff9-11f0-9b9d-42010a2801c2'
};

const queryString = new URLSearchParams(params).toString();
const url = `https://api.tylt.money/transactions/merchant/getPayinTransactionInformation?${queryString}`;

const signaturePayload = JSON.stringify(params);
const signature = crypto.createHmac('sha256', secretKey)
  .update(signaturePayload)
  .digest('hex');

const config = {
  method: 'get',
  url: url,
  headers: {
    'X-TLP-APIKEY': apiKey,
    'X-TLP-SIGNATURE': signature
  }
};

axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.error(error);
  });
