const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;

        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE email = ?',
            [email]
        );

        if(!results.length)
            return res.status(404).send('Email or password is incorrect.')

        const accountPassword = results[0].password;

        const matches = await bcrypt.compare(password, accountPassword);

        if(!matches)
            return res.status(401).send('Email or password is incorrect');

        const accountToken = jwt.sign({...results[0]}, JWT_SECRET);
        res.cookie('accountToken', accountToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(200).send('User is logged in.');
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
});

module.exports = router;