const express = require('express');
const router = express.Router();

//Middlewares
const { verifyJWT } = require('../Middlewares/verifyJWT');
const { checkDuplicateUsernameOrEmail } = require('../Middlewares/verifySignup');
const { ConfirmPassword } = require('../Middlewares/confirmPassword');
//controllers
const { logout } = require('../Controllers/Auth/logout');
const { login } = require('../Controllers/Auth/login');
const { register } = require('../Controllers/Auth/register');
const { VerifyOTP } = require('../Controllers/Auth/verifyotppin');
const { RequestOTP_PIN } = require('../Controllers/Auth/requestotp_pin');
const { PasswordReset, CreateNewPassword, VerifyResetEmail } = require('../Controllers/Auth/forgotpassword');

router.post('/login', login); //login a user
router.post('/register', checkDuplicateUsernameOrEmail, register); //register a user
router.get('/logout', verifyJWT, logout); //logout a user
router.post('/verifyOTP', VerifyOTP); //Verfify OTP Pin
router.post('/reqOTP', RequestOTP_PIN); //Request OPT
router.post('/resetPassword', PasswordReset); //reset password
router.post('/verifyresetpass', VerifyResetEmail); // verify user for reset password
router.post('/newpassword', ConfirmPassword, CreateNewPassword); //create new password

module.exports = router;
