# API Backend Exam (Set 2)

To run this application
- make sure that you have mysql running
- nodejs installed

## Installation Guide



npm i

// create DB
db-migrate db:create db_user
-- after running command above, 
-- add "database" : { "ENV" : "DB_NAME" }, in database.json

// create table
db-migrate create users

// migrate table
db-migrate up

// run this API to add new user and copy the token result
http://localhost:3000/api/addUser

// login authentication using JWT web token. Use Bearer token authorization and paste the token. You may use postman or your preferred API Platform
http://localhost:3000/api/login

// id is required
http://localhost:3000/api/editUser

// fetch users list
http://localhost:3000/api/getUsers