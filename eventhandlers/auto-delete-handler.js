const Discord = require('discord.js');
const { client } = require('../index.js');
const config = require("../config.json");

if(config.autoDelete){
	console.log("Auto Delete Settings below:");
	console.log(config.autoDeleteSettings);
	client.on('message', message =>{
		for (i = 0; i < config.autoDeleteSettings.length; i++) {
			if(config.autoDeleteSettings[i].autoDeleteChannelID === (message.channel.id)){
				console.log(`Counting ${config.autoDeleteSettings[i].autoDeleteTimeout} milliseconds`);
				message.delete({ timeout: config.autoDeleteSettings[i].autoDeleteTimeout }).catch(error => { console.log(`Deleted by ${message.author.tag}`);});
			}
		}
	})
}