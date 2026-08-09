const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.get('/get-name', async (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;
        console.log(req.cookies);

        if(!accountToken) 
            return res.status(401).send("Third-party-cookies and/or cross-site-tracking are not enabled in the browser");

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const name = decodedToken.name;

        res.status(200).send(name);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

});

module.exports = router;