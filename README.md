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
