const express = require('express');
const router = express.Router();

const { RequestOTP_PIN } = require('../Controllers/Auth/RequestOTP_PIN');

router.post('/reqOTPemail', RequestOTP_PIN);

module.exports = router;