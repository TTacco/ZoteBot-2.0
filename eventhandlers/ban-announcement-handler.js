const Discord = require('discord.js');
const { client } = require('../index.js');
const { banAnnouncementSettings : cfg } = require('../config.json');

if(cfg.enabled){
    client.on("guildBanAdd", function(guild, user){
        let banNotificationEmbed = new Discord.MessageEmbed();
			banNotificationEmbed.setTitle('K.O.H. Citation - Exiled');
			banNotificationEmbed.setThumbnail(user.avatarURL());
			banNotificationEmbed.addField(`USER:`,`${user.username}#${user.discriminator}`, true);
			banNotificationEmbed.addField('ID:', user.id, true);
			banNotificationEmbed.addField('REASON:', banReason);
			banNotificationEmbed.addField('ISSUED BY:', `${message.author.username}#${message.author.discriminator}`);
			banNotificationEmbed.setColor('#fc1717');			
			banNotificationEmbed.setTimestamp();
			      
			//Announce the ban with the embed to each of the channels specified in the config file
			cfg.channelsToNotifyID.forEach(channelID => {
				client.channels.cache.get(channelID).send(banNotificationEmbed);
			});
    });
}