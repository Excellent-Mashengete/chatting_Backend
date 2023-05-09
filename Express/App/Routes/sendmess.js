const express = require('express');
const router = express.Router();

//Middlewares
const { verifyJWT } = require('../Middlewares/verifyJWT');

//controllers
const { sendmessages } = require('../Controllers/Users/send');

router.post('/sendmess', verifyJWT, sendmessages); //send messages to users

module.exports = router;