const crypto = require('crypto');
const API_KEY = crypto.randomBytes(32).toString('hex');
const APP_KEY = crypto.randomBytes(32).toString('hex');

console.log({ API_KEY, APP_KEY }); 