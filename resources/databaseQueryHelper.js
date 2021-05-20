const { client } = require('../index.js');
const { connectionPool } = client;

async function insertUserLog(logInfo){

    connectionPool.getConnection((err, connection) => {
        if (err) {
            return console.error('Error connecting to the MySQL database: ' + err.message);
          }

        //let userExistsQuery = `SELECT EXISTS(SELECT 1 FROM users_id WHERE user_id = 188570394012286978 LIMIT 1)`;
        //let userExistsQuery = `SELECT * FROM users_id;`;
        let userExistsQuery = `SELECT EXISTS(SELECT * FROM users_id WHERE user_id = '188570394012286978' LIMIT 1)`;
        
        connection.query(userExistsQuery, function (err, result) {
            if (err) throw err;
            
            if(Object.values(result[0]) > 0) console.log("User exists in the DB");
            else console.log("User does not exist in the DB");
          });

        //1. Check if the user has already added to the primary users_ids table, if so, add them first

        //2. Add the log 
        //let query = `INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')`;


        connection.release();
    }); 


}



module.exports = {
    insertUserLog,
    //insertMuteDuration,
}