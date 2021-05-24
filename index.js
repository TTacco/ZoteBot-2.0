var { botTokenID, databaseCredentials } = require('./resources/token.js');
const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER', 'REACTION'] });
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
client.pool = mysql.createPool({
	connectionLimit : 10,
    host: databaseCredentials.host,
	port: databaseCredentials.port,
    user: databaseCredentials.user,
    password: databaseCredentials.password,
    database: databaseCredentials.database,
});

//Resume Mutes
