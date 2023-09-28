
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'aws-database.cjahgunpk22h.ap-south-1.rds.amazonaws.com',
  port: '3306'
  user: 'admin',
  password: 'LrWctzKqonXuNdMr7Xyl',
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
