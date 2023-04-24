const express = require('express');
const router = express.Router();

//Middlewares
const { verifyJWT } = require('../Middlewares/verifyJWT');
const { checkDuplicateUsernameOrEmail } = require('../Middlewares/verifySignup');

//controllers
const { logout } = require('../Controllers/logout');
const { login } = require('../Controllers/Auth/login');
const { register } = require('../Controllers/Auth/register');
const { VerifyOTP } = require('../Controllers/Auth/verifyOTPPin');
const { RequestOTP_PIN } = require('../Controllers/Auth/RequestOTP_PIN');

router.post('/login', login); //login a user
router.post('/register', checkDuplicateUsernameOrEmail, register); //register a user
router.get('/logout', verifyJWT, logout); //logout a user
router.post('/verifyOTP', VerifyOTP); //Verfify OTP Pin
router.get('/reqOTP', RequestOTP_PIN); //Request OPT

module.exports = router;