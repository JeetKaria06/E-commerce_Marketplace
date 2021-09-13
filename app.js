const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.get("/hey", (req, res) => {
    console.log("hey");
});

app.get("/hello", (req, res) => {
    console.log("hello")
});

app.post("/api/auth/register", (req, res) => {
    const {username, password, type} = req.body;
    const token = jwt.sign(
        {username, type},
        process.env.TOKEN_KEY,
        {
            "expiresIn": "2h",
        },        
    );

    if(password)
    {
        encryptedPassword = bcrypt.hash(password, 10);
        console.log(req.body, encryptedPassword, token);
    }

    res.status(200).send("oy hoy!");
});

// app.listen(port, () => {
//     console.log("Server running on port "+port);
// });

module.exports = app;