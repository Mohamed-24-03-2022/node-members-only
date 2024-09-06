require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { Pool } = require('pg');


module.exports = new Pool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PW,
  database: process.env.DB,
  port: process.env.DB_PORT,
  // ssl: {
  //   ca: fs.readFileSync(path.join(__dirname, '/eu-north-1-bundle.pem'))
  // }
})