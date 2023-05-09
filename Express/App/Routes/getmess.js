const express = require('express');
const router = express.Router();

//Middlewares
const { verifyJWT } = require('../Middlewares/verifyJWT');

//controllers
const { getmessages } = require('../Controllers/Users/getmess');

router.get('/getmess/:receiver', verifyJWT, getmessages); //get all messages of users

module.exports = router;