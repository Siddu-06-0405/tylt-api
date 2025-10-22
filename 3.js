const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const crypto = require('crypto');

const params = {
  reference_id: '753bacea-78ea-4470-b8c4-3fe1cafaca22'
};

const queryString = new URLSearchParams(params).toString();
const url = `https://api.tylt.money/fiatPayout/h2h/request?requestId=?${queryString}`;
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

const signaturePayload = JSON.stringify(params);
const signature = crypto.createHmac('sha256', apiSecret)
  .update(signaturePayload)
  .digest('hex');

const config = {
  method: 'get',
  url: url,
  headers: {
    "Content-Type": "application/json",
    "X-TLP-APIKEY": apiKey,
    "X-TLP-SIGNATURE": signature
  }
};

axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.error(error);
  });
