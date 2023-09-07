const mysql = require('mysql')
const fs = require('fs')

const configPath = 'conf.json';

let config;

try {
  const configFile = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(configFile);
} catch (err) {
  console.error('Error reading or parsing config file:', err);
  process.exit(1);
}

const connection = mysql.createConnection({
    host: config.HOST,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE

    /*host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE*/
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    console.log('Connected to database');
    
  });

module.exports = connection;