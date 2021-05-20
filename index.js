var { botTokenID, databaseCredentials } = require('./resources/token.js');
const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.mutes = [];
client.once('ready', () => {
	console.log('The Great! The Powerful! Zote the Mighty, has arrived!' );
});
client.login(botTokenID);

module.exports = {client: client};

//Export all the commands in the command folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

//Run all the event handler files
const eventHandlers = fs.readdirSync('./eventhandlers').filter(file => file.endsWith('.js'));
for (const file of eventHandlers) {
	require('./eventhandlers/' + file);
}

//Database connection

client.connectionPool = mysql.createPool({
	connectionLimit : 10,
    host: databaseCredentials.host,
	port: databaseCredentials.port,
    user: databaseCredentials.user,
    password: databaseCredentials.password,
    database: databaseCredentials.database,
});

/*
client.connectionPool.getConnection(function(err) {
	if (err) {
	  return console.error('Error connecting to the MySQL database: ' + err.message);
	}

	console.log('Successfully connected to the MySQL database.');
  });
*/



//Mute reapplication
/*
Check database for existing dates
get all users that are still below the millisecond delta (meaning their mute hasnt ended)
*/

const { insertUserLog } = require('./resources/databaseQueryHelper.js');



let logInfo = {id: 188570394012286978 };
insertUserLog(logInfo);