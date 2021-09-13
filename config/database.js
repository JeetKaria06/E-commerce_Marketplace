const { Client } = require('pg');

const client = new Client({
    host: process.env.HOST,
    user: process.env.UNAME,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT
})

client.connect(err => {
    if (err) throw err;
    console.log('Connection Created!');
});

module.exports = client;