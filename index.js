var { botTokenID } = require('./resources/token.js');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('The Great! The Powerful! Zote the Mighty, has arrived!' );
});

client.login(botTokenID);

module.exports = { client: client }

//Run event files
require('./eventhandlers/blacklisted-words-handler.js');
require('./eventhandlers/moderator-command-handler.js'); 
