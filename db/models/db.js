// db.js
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); 

// creating a connection to the database
const pool = mysql.createPool({
  host: process.env.host, 
  user: process.env.user, 
  password: process.env.password, 
  database: process.env.database, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
pool.query("SELECT * FROM customer"), (err, results, fields) => {
  if(err) {
    console.log("dsi bicth ain wokrin",err); 
  }
  else {
    console.log(results); 
  }

}
// Export the pool for use in other files
module.exports = pool.promise();
