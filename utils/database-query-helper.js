const { client } = require('../index.js');
//same
async function addUserLog(logInfo) {
  console.log("Added User Log into the database");
  let insertLogQuery = `INSERT INTO users_log (log_type, log_username, log_reason, log_date, log_moderator, log_user_id)` + 
                ` VALUES ('${logInfo.log_type}', '${logInfo.log_username}', '${logInfo.log_reason}', NOW(), '${logInfo.log_moderator}', ${logInfo.log_user_id})`;

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

//same
async function editUserLog(logNumber, newLog, message) {
  console.log("Editing User Log");
  let editLogQuery = `UPDATE users_log SET log_reason = '${newLog}' WHERE log_id=${logNumber}`;

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
  });

  if(!asyncCon) return;

  try {
    await useAsyncQuery(asyncCon, editLogQuery);
  }
  catch (err) {
    console.log(err);
  }
  finally {
    asyncCon.release();
  }

}

//same 
async function addMuteEnd(muteEnd, id) {
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

//same
async function retrieveUserLogs(logUserID) {
  console.log("Retrieving user Log");
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

async function executeQuery(query, requiredUser){
  console.log("Executing query " + query);

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
  });

  if(!asyncCon) return;

  try {
    let rows = await useAsyncQuery(asyncCon, query);
    return rows;
  }
  catch (err) {
    console.log(err);
    return null;
  }
  finally {
    asyncCon.release();
  }

  return results;
}

//same
async function retrieveMutes() {
  let retrieveQuery = `SELECT user_id FROM zotedb.users_id WHERE mute_end > NOW()`;
  //let retrieveQuery = `SELECT * FROM users_id`;

  let asyncCon = await getAsyncConnection().catch((err) => {
    console.error('[DBQueryHelper] Error connecting to the MySQL database: ' + err);
  });

  if(!asyncCon) return;

  try {
    let muteEnds = await useAsyncQuery(asyncCon, retrieveQuery);

    //console.log("[DB QUERY] ", muteEnds);
    return muteEnds;
  }
  catch (err) {
    console.log(err);
  }
  finally {
    asyncCon.release();
  }

  return null;
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
  editUserLog,
  checkIfUserExists,
  getAsyncConnection,
  useAsyncQuery,
  executeQuery,
  addMuteEnd,
  retrieveUserLogs,
  retrieveMutes
}