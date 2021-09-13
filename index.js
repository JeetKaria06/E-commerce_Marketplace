// const express = require('express');
// const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.BEPORT;
const http = require("http")
const server = http.createServer(require('./app.js'));
// app.use(express.json());
// app.use(
//     express.urlencoded({
//         extended: true
//     })
// );

server.listen(port, () => {
    console.log("Server running on port "+port);
});

const client = require('./config/database.js')
 
client.query('SELECT NOW()', (err, res) => {
    console.log(res.rows)
});

