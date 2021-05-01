const Discord = require('discord.js');
const { client } = require('../index.js');
const config = require('../config.json');

client.on('message', message =>{
	if(config.mediaOnlyChannelID.includes(message.channel.id)){

		console.log('Reading');
		if(message.attachments.size === 0 && !message.member.hasPermission('BAN_MEMBERS') || (message.attachments.size > 0 && message.content && !message.member.hasPermission('BAN_MEMBERS'))){
			message.reply('This channel is strictly for media only');	
			message.author.send(`Sorry but ${message.channel.name} in the ${message.guild.name} server is a media only channel`);
			message.delete();
			
			if(config.mediaOnlyLogging === "true"){
				for (i = 0; i < config.mediaOnlyLoggingChannelID.length; i++) {
					var channelDestination = client.channels.cache.get(config.mediaOnlyLoggingChannelID[i]);
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