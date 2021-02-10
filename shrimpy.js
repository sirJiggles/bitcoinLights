const crypto = require('crypto');
const lights = require('./lights').default;

// This is base64 encoded
const secret = '6991cf4c9b51...';

const nonce = Date.now();
const requestPath =
  '/v1/users/70e3a52a-4fda-464d-b4af-029f55cbd9be/accounts/123/rebalance_period';

const body = JSON.stringify({
  rebalancePeriod: 24,
});

const method = 'POST';

// create the prehash string by concatenating required parts
const prehashString = requestPath + method + nonce + body;

// decode the base64 secret
const key = Buffer(secret, 'base64');

// create a sha256 hmac with the secret
const hmac = crypto.createHmac('sha256', key);

// hash the prehash string and base64 encode the result
return hmac.update(prehashString).digest('base64');
