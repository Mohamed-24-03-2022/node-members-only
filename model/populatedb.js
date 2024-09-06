require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  username VARCHAR (255) NOT NULL,
  password TEXT NOT NULL,
  is_member BOOLEAN,
  is_admin BOOLEAN
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR (255) NOT NULL,
  text TEXT NOT NULL,
  added DATE,
  owner_id INT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
`;


async function main() {
  const { HOST, DB_USER, PW, DB, DB_PORT } = process.env
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${DB_USER}:${PW}@${HOST}:${DB_PORT}/${DB}`,
    // ssl: {
    //   ca: fs.readFileSync(path.join(__dirname, '/eu-north-1-bundle.pem'))
    // }

  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();