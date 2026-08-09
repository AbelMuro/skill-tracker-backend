const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const CheckLoginStatus = require('./Routes/GET/CheckLoginStatus.js');
const Register = require('./Routes/POST/Register.js');
const Login = require('./Routes/POST/Login.js');
const SendResetLink = require('./Routes/POST/SendResetLink.js');
const ResetPassword = require('./Routes/PUT/ResetPassword.js');
const GetName = require('./Routes/GET/GetName.js');
const app = express();
const PORT = 4000;

app.get('/', (req, res) => {
    res.status(200).send('Hello world');
})


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'DELETE', 'GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}))
app.use(CheckLoginStatus);
app.use(Register);
app.use(Login);
app.use(SendResetLink);
app.use(ResetPassword);
app.use(GetName);

app.listen(PORT, (error) => {
    if(error) {
        return console.log(error);
    }

    console.log(`Server is running on port: ${PORT}`)
});