// const express = require('express');
// const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.BEPORT;
const http = require("http")
const server = http.createServer(require('./app.js'));

server.listen(port, () => {
    console.log("Server running on port "+port);
});
