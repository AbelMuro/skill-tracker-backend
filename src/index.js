const express = require('express');
const cookieParser = require('cookie-parser');
const CheckLoginStatus = require('./Routes/GET/CheckLoginStatus.js');
const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
    res.status(200).send('Hello world');
})


app.use(express.json());
app.use(cookieParser());
app.use(CheckLoginStatus);


app.listen(PORT, (error) => {
    if(error) {
        return console.log(error);
    }

    console.log(`Server is running on port: ${PORT}`)
});