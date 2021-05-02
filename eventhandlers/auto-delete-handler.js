const Discord = require('discord.js');
const { client } = require('../index.js');
const config = require("../config.json");

client.on('message', message =>{
	if(config.autoDeleteChannelID.includes(message.channel.id)){
		console.log('Reading');
		message.delete({ timeout: config.autoDeleteTimeout });
	}
})