const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const db = require('../../Config/MySQL/db.js');

router.put('/reset-password', async (req, res) => {
    try{
        const {resetToken, password} = req.body;
        const hashedToken = crypto.randomBytes(32).toString('hex');

        const [accounts] = await db.execute(
            'SELECT * FROM accounts WHERE resetToken = ?',
            [hashedToken]
        );

        if(!accounts.length)
            return res.status(404).send("Reset Token is invalid.");

        const account = accounts[0];
        const accountResetToken = account.resetToken;
        const resetTokenExpiration = account.resetTokenExpiration;

        if(accountResetToken !== hashedToken)
            return res.status(401).send("Reset Token is invalid.");

        if(resetTokenExpiration < Date.now())
            return res.status(401).send('Reset Token has expired.');

        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [results] = await db.execute(
            'UPDATE accounts SET resetToken = ?, resetTokenExpiration = ?, password = ? WHERE resetToken = ?',
            ['', '', hashedPassword, hashedToken]
        );

        if(!results.affectedRows)
            return res.status(500).send(results.message);

        res.status(200).send('Password has been updated.');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;