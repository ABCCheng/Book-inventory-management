
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '',
  port: '',
  user: '',
  password: '',
  database: '',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,      
});

module.exports = pool;
