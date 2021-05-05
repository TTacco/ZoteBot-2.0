var { botTokenID } = require('./resources/token.js');
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER'] });
client.commands = new Discord.Collection();
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
