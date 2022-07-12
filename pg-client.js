const { Pool, Client } = require('pg')
const { DB_CONNECTION_URL, DB_HOSTNAME, DB_USERNAME, DB_DATABASE, DB_PASSWORD, DB_PORT, CA_CERT } = require('./config')

exports.pool = new Pool({
  // connectionString: DB_CONNECTION_URL,
  user: DB_USERNAME,
  host: DB_HOSTNAME,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
  ssl: {
    ca: CA_CERT
  }
})
