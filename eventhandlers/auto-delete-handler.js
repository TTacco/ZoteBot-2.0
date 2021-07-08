const Discord = require('discord.js');
const { client } = require('../index.js');
const { autoDeleteSettings : cfg } = require("../config.json");

if(cfg.enabled){
	console.log("Auto Delete Settings below:");
	client.on('message', message =>{

		for (i = 0; i < cfg.channelsWithAutoDelete.length; i++) {
			if(cfg.channelsWithAutoDelete[i].channelID === (message.channel.id)){
				console.log(`Counting ${cfg.channelsWithAutoDelete[i].timeout} milliseconds`);
				message.delete({ timeout: cfg.channelsWithAutoDelete[i].timeout }).catch(error => { console.log(`Deleted by ${message.author.tag}`);});
			}
		}
	})
}