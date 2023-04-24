const express = require('express');
const router = express.Router();


const { verifyJWT } = require('../Middlewares/verifyJWT');
const upload = require('../Middlewares/profileUpdate');

const profileControllers = require('../Controllers/profile');

router.get('/profile', verifyJWT, profileControllers.getProfile);
router.patch('/profile', [verifyJWT, upload.single("image")], profileControllers.updateProfile);

module.exports = router;