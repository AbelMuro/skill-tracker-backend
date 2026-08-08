const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.post('/send-reset-link', async (req, res) => {
    try{
        const {email} = req.body;
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        const resetTokenExpiration = Date.now() * 60 * 1000;
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        const [results] = await db.execute(
            'UPDATE accounts SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?',
            [hashedResetToken, resetTokenExpiration, email]
        );

        if(!results.affectedRows)
            return res.status(404).send("Account doesn't exist.");

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.email,
                pass: process.env.pass
            }
        });

        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Reset link for Skill-Tracking app',
            text: `
                Please click on the following link to reset your password
                ${resetLink}
            `
        }

        await transporter.sendMail(mailOptions);

        res.status(200).send('Email sent successfully');
        
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;