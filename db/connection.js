const mysql= require('mysql');
const PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./local.properties');

//DB
var connection = mysql.createConnection({
  host: properties.get('database.host'),
  user: properties.get('database.user'),
  password: properties.get('database.password'),
  database: properties.get('database.database')
});

module.exports = connection;
