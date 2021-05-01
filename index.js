var { botTokenID } = require('./modules/token.js');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('ZOTEBOT STATUS: ENABLED');
});

client.login(botTokenID);

module.exports = {client: client};

//Run event files
require('./eventhandlers/media-only-handler');