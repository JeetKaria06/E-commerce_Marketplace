const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const client = require('./config/database.js');
const auth = require('./middleware/auth.js');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.post("/api/auth/register", (request, response) => {
    const {username, password, type} = request.body;
    
    if(!(username && password && type))
    {
        res.status(400).send("All input is required i.e. username, password and type in the order!");
    }
    else
    {
        const token = jwt.sign(
            {username, type},
            process.env.TOKEN_KEY,
            {
                "expiresIn": "2h",
            },        
        );
        client.query('select * from "Users" where username=$1;', [username], (err, res) => {
            if(err) throw err;
            if(res.rows.length==0)
            {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, encryptedPassword) {
                        client.query('insert into "Users" (username, password, type) values ($1, $2, $3);', [username, encryptedPassword, type], (err, res) =>{
                            if(err) throw err;
                            response.status(200).json({"username": username, "type": type, "token":token});
                        });
                    });
                });
            }
            else
                response.status(409).send("User Already Exists!");
        });
    }
});

app.post("/api/auth/login", (request, response) => {
    const {username, password, type} = request.body;

    if(!(username && password && type))
    {
        res.status(400).send("All input is required i.e. username, password and type in the order!");
    }
    else
    {
        client.query('select * from "Users" where username=$1', [username], (err, res) => {
            if(err) throw err;
            if(res.rows.length==0 || res.rows[0].type!=type)
            {
                response.status(400).send("Invalid Username or User type!");
            }
            else
            {
                bcrypt.compare(password, res.rows[0].password, function(err, data) {
                    if(err) throw err;
                    if(data)
                    {
                        const token = jwt.sign(
                            {username, type},
                            process.env.TOKEN_KEY,
                            {
                                "expiresIn": "2h",
                            },        
                        );
                        response.status(200).json({"username": username, "type": type, "token":token});
                    }
                    else
                    {
                        response.status(400).send("Invalid Password!")
                    }
                });   
            }
        });
    }
});

app.post("/welcome", auth, (request, response) => {
    response.status(200).send("Welcome 🙌 "+request.user.username+" "+request.user.type);
});



module.exports = app;