const Discord = require('discord.js');
const { client } = require('../index.js');
const config = require('../config.json');

if(config.mediaOnly){
	console.log("Media Only Settings below:");
	console.log(config.mediaOnlySettings);

	client.on('message', message =>{
		for (i = 0; i < config.mediaOnlySettings.length; i++) {
			if(config.mediaOnlySettings[i].mediaOnlyChannelID === (message.channel.id) && !message.author.bot){
				console.log('Reading');
				message.reply('This channel is strictly for media only');	
				message.author.send(`Sorry but ${message.channel.name} in the ${message.guild.name} server is a media only channel`);
				message.delete().catch(error => {console.log(`Deleted by ${message.author.tag}`);});

				if(config.mediaOnlySettings[i].mediaOnlyLoggingChannelID != null){
					for (x = 0; x < config.mediaOnlySettings[i].mediaOnlyLoggingChannelID.length; x++) {
						var channelDestination = client.channels.cache.get(config.mediaOnlySettings[i].mediaOnlyLoggingChannelID[x]);
						var warnUserEmbed = new Discord.MessageEmbed();
						warnUserEmbed.setAuthor(`USER: ${message.author.tag}`);
						warnUserEmbed.setThumbnail(message.author.avatarURL());
						warnUserEmbed.setTitle(`Attempting to send text in: ${message.channel.name}`);
						warnUserEmbed.setDescription(`User said: "${message}"`);
						warnUserEmbed.setFooter(`User ID: ${message.author.id}`);
						warnUserEmbed.setColor('#FF4444');
						channelDestination.send(warnUserEmbed);
					}
				}
			}
		}
	})
}