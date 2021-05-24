const { client } = require('../index.js');

async function addUserLog(logInfo) {
  console.log("Add User Log");
  let insertLogQuery = `INSERT INTO users_log (log_type, log_username, log_reason, log_date, log_user_id)` + 
                ` VALUES ('${logInfo.log_type}', '${logInfo.log_username}', '${logInfo.log_reason}', NOW(), ${logInfo.log_user_id})`;

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
  });

  if(!asyncCon) return;

  try {
    await checkIfUserExists(asyncCon, logInfo.log_user_id);
    await useAsyncQuery(asyncCon, insertLogQuery)
  }
  catch (err) {
    console.log(err);
  }
  finally {
    asyncCon.release();
  }

}


async function addMuteEnd(muteEnd, id) {
  console.log("Mute End");
  let insertLogQuery = `UPDATE users_id SET mute_end = ${muteEnd} WHERE user_id=${id}`;

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
  });

  if(!asyncCon) return;

  try {
    await checkIfUserExists(asyncCon, id);
    await useAsyncQuery(asyncCon, insertLogQuery)
  }
  catch (err) {
    console.log(err);
  }
  finally {
    asyncCon.release();
  }

}

async function retrieveUserLogs(logUserID) {
  console.log("Add User Log");
  let retrieveQuery = `SELECT * FROM users_log WHERE log_user_id = ${logUserID} ORDER BY log_date DESC`;

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
  });

  if(!asyncCon) return;

  try {
    await checkIfUserExists(asyncCon, logUserID);
    let userLogs = await useAsyncQuery(asyncCon, retrieveQuery);
    return userLogs;
  }
  catch (err) {
    console.log(err);
  }
  finally {
    asyncCon.release();
  }

}

//Checks whether the ID given already exists in the DB, if not, add it
async function checkIfUserExists(connection, userid) {

  const existQuery = `SELECT EXISTS(SELECT * FROM users_id WHERE user_id = ${userid} LIMIT 1);`;
  const insertQuery = `INSERT INTO users_id (user_id) VALUES (${userid});`;
    let user = await useAsyncQuery(connection, existQuery); //Query if the user exists

    if ((Object.values(user[0])) < 1) {
      console.log('User does not exist, and will be added to the DB');
      await useAsyncQuery(connection, insertQuery); //Insert the user into the database
      console.log('Succesfully added user to the DB'); 
    } 
}

let getAsyncConnection = () => {
  return new Promise((resolve, reject) => {
    client.pool.getConnection((err, connection) => {
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
  addUserLog,
  checkIfUserExists,
  getAsyncConnection,
  useAsyncQuery,
  addMuteEnd,
  retrieveUserLogs
}