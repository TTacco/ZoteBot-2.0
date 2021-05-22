const { client } = require('../index.js');
const { pool } = client;

async function insertUserLog(logInfo) {
  //let query2 = `INSERT INTO users_id (user_id) VALUES ('${logInfo.id}')`;


  //let err = await checkIfUserExists(logInfo);

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
    return;
  });

  try {
    let result = await useAsyncQuery(asyncCon, `SELECT EXISTS(SELECT * FROM users_id WHERE user_id = '${logInfo.id}' LIMIT 1)`);

    console.log(result);
  }
  catch (err) {
    console.log(err);
  }
  finally {
    asyncCon.release();
  }

}

async function checkIfUserExists(logInfo) {

  let query1 = `SELECT EXISTS(SELECT * FROM users_id WHERE user_id = '${logInfo.id}' LIMIT 1)`;
  let noErrors = true;

  //1. Check if the user has already added to the primary users_ids table, if so, add them first
  pool.getConnection((err, con) => {
    try {
      if (err) {
        return console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err.message);
      };

      //Query to check if the user exists, if not, add them to the database
      con.query(query1, (err, rows) => {
        if (err) {
          con.release();
          throw qryErr;
        };

        if (!(Object.values(rows[0]) > 0)) {
          console.log('[DBQueryHelper] User does not exist in the database and will be added.');

          //Query to insert the unknown ID 
          con.query(query2, (err) => {
            if (err) {
              con.release();
              throw qryErr;
            };

            console.log(`[DBQueryHelper] Successfully added ID:${logInfo.id} to the database`);
          });
        }
        else {
          console.log('[DBQueryHelper] User already exists');
        }

      });


    }
    catch (err) {
      console.error('[DBQueryHelper] ' + err);
      noErrors = false;
    }
    finally {
      con.release();
      return noErrors;
    }
  });

}

let getAsyncConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
};

let useAsyncQuery = (con, query) => {
  return new Promise((resolve, reject) => {
    con.query(query, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  insertUserLog,
  checkIfUserExists,
  getAsyncConnection,
  useAsyncQuery,
}