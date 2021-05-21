const { client } = require('../index.js');
const { pool } = client;

async function insertUserLog(logInfo) {

  let query1 = `SELECT EXISTS(SELECT * FROM users_id WHERE user_id = '${logInfo.id}' LIMIT 1)`;
  let query2 = `INSERT INTO users_id (user_id) VALUES ('${logInfo.id}')`;

  /*
  function test(cb){
    function closure(){
      connection.release();
      cb.apply(this, arguments);
    };

    return closure;
  }

  let callback = test;
  callback(callback);
  */
  
  //1. Check if the user has already added to the primary users_ids table, if so, add them first

  try {
    pool.getConnection((err, con) => {
      if (err) {
        return console.error('Error connecting to the MySQL database: ' + err.message);
      };

      //Query to check if the user exists, if not, add them to the database
      con.query(query1, (err, rows) => {
        if (err){
          con.release();
          throw qryErr;
        };

        if(!(Object.values(rows[0]) > 0)){
          console.log('USER DOES NOT EXIST');
          
          //Query to insert the unknown ID 
          con.query(query2, (err) => {
            if (err){
              con.release();
              throw qryErr;
            };

            console.log(`SUCCESSFULLY ADDED USER ID:${logInfo.id} TO THE DATABASE`);
          });
        };

      });

      //2. Add the log 



      con.release();
    });
  }
  catch (err) {
    console.log(err);
  }
}



module.exports = {
  insertUserLog
}