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


app.get("/api/buyer/list-of-sellers", auth, (request, response) => {
    if(request.user.type=="buyer")
    {
        client.query(`select username from "Users" where type='seller'`, (err, res) => {
            if(err) throw err;
            if(res.rows.length>0)
            {
                response.status(200).send(res.rows);
            }
            else
            {
                response.status(200).send("No sellers data available!");
            }
        });
    }
    else
        response.status(401).send("Login as buyer!");
});


app.get("/api/buyer/seller-catalog/:seller_id", auth, (request, response) => {
    if(request.user.type=="buyer")
    {
        client.query(`select * from "Products" where seller_id=$1;`, [request.params.seller_id], (err, res) => {
            if(err) throw err;
            response.status(200).send(res.rows);
        });
    }
    else
    {
        response.status(401).send("Login as buyer!");
    }
});


app.post("/api/buyer/create-order/:seller_id", auth, (request, response) => {
    if(request.user.type=="buyer")
    {
        client.query(`select id from "Products" where seller_id=$1;`, [request.params.seller_id], (err, res) => {
            if(err) throw err;
            let prod_uuid_list = [];
            if(res.rows.length>0)
            {
                res.rows.forEach(function(item) {
                    prod_uuid_list.push(item.id);
                    if(prod_uuid_list.length==res.rows.length)
                    {
                        client.query(`insert into "Orders" (buyer_id, seller_id, items) values ($1, $2, $3);`, [request.user.username, request.params.seller_id, prod_uuid_list], (err, res) => {
                            if(err) throw err;
                            response.status(200).send("Order Created :)");
                        });
                    }
                });
            }
            else
                response.status(400).send("Either seller_id doesn't exist or seller_id has no catalog yet!");
        });
    }
    else
        response.status(401).send("Login as seller!");
});


app.post("/api/seller/create-catalog", auth, (request, response) => {
    if(request.user.type=="seller")
    {
        let prod_uuid_list = [];
        if(request.body.catalog)
        {
            request.body.catalog.map(function(item) {
                client.query(`insert into "Products" (name, price, seller_id) values ($1, $2, $3) returning id;`, [item.name, item.price, request.user.username], (err, res) => {
                    if(err) throw err;
                    prod_uuid_list.push(res.rows[0].id);
                    if(prod_uuid_list.length == request.body.catalog.length)
                    {
                        response.status(200).send("Products are inserted into catalog of yours :)");
                    }
                });
            });
        }
        else
        {
            response.status(400).send("Enter list of json objects which contains product name and price in Integer in catalog key.");
        }
    }
    else
    {
        response.status(401).send("Login as seller!");
    }
});


app.get("/api/seller/orders", auth, (request, response) => {
    if(request.user.type=="seller")
    {
        client.query(`select * from "Orders" where seller_id=$1`, [request.user.username], (err, res) => {
            if(err) throw err;
            if(res.rows.length>0) 
                response.status(200).send(res.rows);
            else
                response.status(200).send("No orders received yet :(");
        });
    }
    else
        response.status(401).send("Login as seller!");
});

module.exports = app;