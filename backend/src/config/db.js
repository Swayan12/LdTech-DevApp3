
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Sambit@12345',
  database: 'ldtech',
  waitForConnections: true,
});


pool.getConnection()
  .then((connection) => {
    console.log('Connected to MySql');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error('Error while connecting to DB:', err);
  });


module.exports = pool;
