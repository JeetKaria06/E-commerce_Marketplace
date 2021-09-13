# E-commerce_Marketplace

This helps sellers to create catalog and sell their products and buyers to browse different products of sellers and create an order for their use.

## Steps to run it in your localhost

* Create .env file (in the same directory where all the above files are existing) by running setup_env.sh file using below command (make sure you are in the folder where all the above files are present)
```
sh setup_env.sh
```

This will generate different keys as shown below and fill the suitable values there:
```
HOST="Name of the host"
UNAME="User name"
PASSWORD="Password of the username"
DATABASE="name of the database"
DBPORT="database port"
BEPORT="backend server port"
TOKEN_KEY="key with which jwt will be signed"
```

* Run below command to install all the dependencies to run the server:
```
npm install --save
```

* Run below command to run the server
```
npm run dev
```

The server is up and running now!

> One can add authentication token to the request body or to the request query or in the header with key "x-access-token"

---
**NOTE**

When this server runs it creates the tables needed and if the table with same name exists in your localhost then it may create problem. So, it is necessary that you first delete tables named "Users", "Products", and "Orders" from your database.

Also, it is assumed that you have postgresql in your machine pre-installed. If it is not, then refer [this](https://www.postgresql.org/download/linux/ubuntu/).

---
