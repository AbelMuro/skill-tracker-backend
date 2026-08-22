const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {v4 : uuid} = require('uuid');
const {config} = require('dotenv');
config();

router.post('/create-session', async (req, res) => {
    try{
        const {skill, desc, time, unit} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send("Third-party-cookies and/or cross-site-tracking are not enabled in the browser");

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;
        console.log(decodedToken.skills);
        const skills = decodedToken.skills.split(',');
        const skillExists = skills.some((currentSkill) => {
            return currentSkill === skill
        })

        if(!skillExists){
            skills.push(skill);
            const newSkills = skills.join(',');
            const [result] = await db.execute(
                'UPDATE accounts SET skills = ? WHERE id = ?',
                [newSkills, accountId]
            );

            if(!result.affectedRows) 
                return res.status(500).send(result.message);

            const newAccountToken = jwt.sign({...decodedToken, skills: newSkills}, JWT_SECRET);
            res.cookie('accountToken', newAccountToken);           
        }

        const sessionId = uuid();
        const currentTime = Date.now();

        const [results] = await db.execute(
            'INSERT INTO skill_sessions (id, skill, description, time, date, accountId) VALUES (?, ?, ?, ?, ?, ?)',
            [sessionId, skill, desc, `${time} ${unit}`, currentTime, accountId]
        );

        if(!results.affectedRows)
            return res.status(500).send(results.message);

        res.status(200).send('Session has been recorded');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;