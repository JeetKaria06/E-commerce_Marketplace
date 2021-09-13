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

let query = `
    DO
    $do$
    BEGIN
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    IF NOT EXISTS (SELECT * from information_schema.Tables where table_name='Users') THEN
        RAISE NOTICE 'Users not exists';
        create table "Users" (username varchar primary key, password varchar, type varchar);
    ELSE
        RAISE NOTICE 'Users exists';
    end if;
    IF NOT EXISTS (SELECT * from information_schema.Tables where table_name='Products') THEN
        RAISE NOTICE 'Products not exists';
        create table "Products" (id uuid default gen_random_uuid() primary key, name varchar, price integer, seller_id varchar references "Users"(username));
    ELSE
        RAISE NOTICE 'Products exists';
    end if;
    IF NOT EXISTS (SELECT * from information_schema.Tables where table_name='Orders') THEN
        RAISE NOTICE 'Orders not exists';
        create table "Orders" (id uuid default gen_random_uuid() primary key, buyer_id varchar references "Users"(username), seller_id varchar references "Users"(username), items uuid[]);
    ELSE
        RAISE NOTICE 'Orders exists';
    end if;
    end;
    $do$
`

client.query(query, (err, data) => {
    if(err) throw err;
    console.log("Tables Created!");
});

module.exports = client;