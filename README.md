# API Backend Exam (Set 2)

To run this application
- make sure that you have mysql running
- nodejs installed

## Installation Guide
1. Open your ssh terminal and run these commands
```sh
$ git clone https://github.com/natesparas/yondu_set2.git
$ cd yondu_set2
$ npm i
```

2. Create database
```sh
$ db-migrate db:create db_user
```
> `if db-migrate command not found, try `

```sh
$ npm install -g db-migrate
```

```sh
$ db-migrate db:create db_user
```
> `add this code inside database.json`   
> `"database" : { "ENV" : "DB_NAME" },`



3. Create table
```sh
$ db-migrate create users
```
> `refactor the code in export.up and export.down in -user.js located at migations folder`

```js  
exports.up = function(db, callback) {
       db.createTable('users', {
               id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true },
               firstName: { type: 'string', length: 100, notNull: false },
               lastName: { type: 'string', length: 100, notNull: false },
               address: { type: 'string', length: 100, notNull: false },
               postCode: { type: 'string', length: 100, notNull: false },
               phoneNumber: { type: 'string', length: 50, notNull: false },
               Email: { type: 'string', length: 100, notNull: false },
               username: { type: 'string', length: 100, notNull: true },
               password: { type: 'string', length: 100, notNull: true },
       }, callback);
};

exports.down = function(db) {
       return db.dropTable('users');
};
```  


4. Migrate table fields
```sh
$ db-migrate up
```

5. Run application
```sh
$ npm start
```


# Table Structure
   > |Field Name      |Data type                      |Description                  |
   > |----------------|-------------------------------|-----------------------------|
   > |id              |`INT(11)`                      |`PK - NN - AI`               |
   > |firstName       |`VARCHAR(100)`                 |`Default: NULL`              |
   > |lastName        |`VARCHAR(100)`                 |`Default: NULL`              |
   > |address         |`VARCHAR(100)`                 |`Default: NULL`              |
   > |postCode        |`VARCHAR(100)`                 |`Default: NULL`              |
   > |phoneNumber     |`VARCHAR(50)`                  |`Default: NULL`              |
   > |email           |`VARCHAR(100)`                 |`Default: NULL`              |
   > |username        |`VARCHAR(100)`                 |`NN`                         |
   > |password        |`VARCHAR(100)`                 |`NN`                         |


# API Endpoints User Guide

### To test the API, we will be using postman. But you can use your preferred API Platform

****
## Step 1
  *First, you need to add new user and get the token result.*
  - **Access Path**: http://localhost:3000/api/
  - **Method**: POST
  - **Service Name**: addUser
> **Sample request**

```json
{
        "firstName" : "Cardo",
        "lastName" : "Dalisay",
        "address" : "Makati City",
        "postCode" : "1701",
        "phoneNumber" : "09123456789",
        "email" : "cardodalisay@gmail.com",
        "username" : "cardo3",
        "password" : "dalisay"
}
```

> **Sample result**
```json
{
    "code": "000",
    "message": "Successfully Added!",
    "token": "eyJhbGciOiJIUzI1NiJ9.MTU.Gp7Ux_nWNGUAzXP9J3EwvyHUbBxfV7AC76DuhXk5mis"
}
```

*✨Don't forget to copy the token result✨*
****
## Step 2
*Paste **token** in the **Autherization > Type: Bearer Token***
  - **Access Path**: http://localhost:3000/api/
  - **Method**: POST
  - **Service Name**: login
  
> **Sample request**

```json
{
        "username": "cardo2",
        "password": "dalisay"
}
```

> **Sample result**
```json
{
    "code": "200",
    "message": "Logged in!",
    "user": {
        "firstName": "Cardo",
        "lastName": "Dalisay",
        "address": "Makati City",
        "postCode": "1701",
        "phoneNumber": "09123456789",
        "username": "cardo3"
    }
}
```

****   
## Step 3
*Get Users List*
  - **Access Path**: http://localhost:3000/api/
  - **Method**: GET
  - **Service Name**: getUsers

> **Sample result**
```json
{
    "code": "200",
    "message": "Users List",
    "data": [
        {
            "id": 4,
            "firstName": "Cardo",
            "lastName": "Dalisay",
            "address": "Makati City",
            "postCode": "1701",
            "phoneNumber": "09123456789",
            "Email": "cardodalisay@gmail.com",
            "username": "cardo",
            "password": "$2a$10$JLRPKm9Xfmquh7GRMJ1SZuH7IJ4vRaia84b/bmLnDSSRhSTAnWX0q"
        },
        {
            "id": 15,
            "firstName": "Cardo",
            "lastName": "Dalisay",
            "address": "Makati City",
            "postCode": "1701",
            "phoneNumber": "09123456789",
            "Email": "cardodalisay@gmail.com",
            "username": "cardo3",
            "password": "$2a$10$fU1TVZuGD1jST5g8V7PpS.Ti9H72ffUAQsksK2kTbaN1TRbkAo87i"
        }
    ]
}
```

****
## Step 4
*Edit User. **id is required**. Get id from the **getUsers** endpoint.*
  - **Access Path**: http://localhost:3000/api/
  - **Method**: PUT
  - **Service Name**: editUser
> **Sample request**

```json
{
        "id": 15,
        "firstName": "Pedro"
}
```

> **Sample result**
```json
{
    "code": "200",
    "message": "User has been successfully updated!",
    "data": [
        {
            "id": 15,
            "firstName": "Pedro",
            "lastName": "Dalisay",
            "address": "Makati City",
            "postCode": "1701",
            "phoneNumber": "09123456789",
            "Email": "cardodalisay@gmail.com",
            "username": "cardo3",
            "password": "$2a$10$fU1TVZuGD1jST5g8V7PpS.Ti9H72ffUAQsksK2kTbaN1TRbkAo87i"
        }
    ]
}
```
****
## Step 5
*Delete User by ID. **id is required**. Get id from the **getUsers** endpoint.*
  - **Access Path**: http://localhost:3000/api/
  - **Method**: DELETE
  - **Service Name**: deleteUserByID
> **Sample request**

```json
{
        "id": 15
}
```

> **Sample result**

```json
{
    "code": "200",
    "message": "User has been successfully deleted!"
}
```
****
## Step 6
*Delete Multiple User. **id is required and must be in array**. Get id from **getUsers** endpoint.*
  - **Access Path**: http://localhost:3000/api/
  - **Method**: DELETE
  - **Service Name**: deleteUsers
> **Sample request**
```json
{
        "id": [5,16]
}
```

> **Sample result**
```json
{
    "code": "200",
    "message": {
        "Failed": "User with id: 5 does not exist!",
        "Success": {
            "message": "User with id: 16 has been successfully deleted!"
        }
    }
}
```