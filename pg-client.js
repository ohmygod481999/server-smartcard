const { Pool, Client } = require('pg')
const { DB_CONNECTION_URL } = require('./config')

exports.pool = new Pool({
  connectionString: DB_CONNECTION_URL,
})
