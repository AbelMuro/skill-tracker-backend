const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const bcrypt = require('bcrypt');
const {v4 : uuid} = require('uuid');


router.post('/register', async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const accountId = uuid();
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO accounts (id, name, email, password) VALUES (?, ?, ?, ?)',
            [accountId, name, email, hashedPassword]
        )

        if(!result.affectedRows)
            return res.status(500).send(result.message);

        res.status(200).send('Account created successfully');
    }
    catch(error){
        const message = error.message;
        const code = error.code;
        console.log(code, message);

        if(code === 'ER_DUP_ENTRY')
            return res.status(401).send('Email already exists');
        else
            return res.status(500).send(message);
    }
});

module.exports = router;