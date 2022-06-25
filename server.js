require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mysql = require('mysql');

const app = express();
const db  = require('./config/dbConnection');
const router = require('./router.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/api', router);

// default route
// app.get('/', function (req, res) {
// 	return res.send({ error: true, message: 'hello' })
// });

// set port
app.listen(3000, function () {
	console.log('Node app is running on port 3000');
});
module.exports = app;