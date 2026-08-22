const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get-skills', async (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!accountToken)
            return res.status(401).send("Third-party-cookies and/or cross-site-tracking are not enabled in the browser");

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'SELECT * FROM skill_sessions WHERE accountId = ?',
            [accountId]
        );

        if(!results.length)
            return res.status(404).send('User has not registered any skills.');

        const formattedSkills = {};

        results.map((session) => {
            const skill = session.skill.toLowerCase();

            if(!formattedSkills[skill]){
                formattedSkills[skill] = [session];
                delete formattedSkills[skill][0].skill;
            }
            else
                formattedSkills[skill].push(session);         
        });

        res.status(200).json(formattedSkills);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;