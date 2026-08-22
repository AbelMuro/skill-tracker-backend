const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.get('/check-login-status', async (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('User is not logged in');
  
        const JWT_SECRET = process.env.JWT_SECRET;
        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const name = decodedToken.name;


        res.status(200).send(name[0]);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;