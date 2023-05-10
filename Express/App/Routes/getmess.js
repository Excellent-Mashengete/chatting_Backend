const express = require('express');
const router = express.Router();

//Middlewares
const { verifyJWT } = require('../Middlewares/verifyJWT');

//controllers
const { getmessages } = require('../Controllers/Users/getmess');
const { getallchats } = require('../Controllers/Users/getallchats');

router.get('/getmess/:receiver', verifyJWT, getmessages); //get all messages of users
router.get('/getchats', verifyJWT, getallchats); //get all messages of users

module.exports = router;