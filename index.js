var { botTokenID } = require('./token.js');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login(botTokenID);

client.on('message', message => {
	if (message.content === '!awaken') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Ensuring the destruction of shitposters.');
    }
    
});

