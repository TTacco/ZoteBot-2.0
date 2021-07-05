const Discord = require('discord.js');
const { client } = require('../index.js');
const { banAnnouncementSettings : cfg } = require('../config.json');

if(cfg.enabled){
    client.on("guildBanAdd", function(guild, user){
        let banNotificationEmbed = new Discord.MessageEmbed();
			banNotificationEmbed.setTitle('M.O.H. Citation - Exiled');
			banNotificationEmbed.setThumbnail(user.avatarURL());
			banNotificationEmbed.addField(`USER:`,`${user.username}#${user.discriminator}`, true);
			banNotificationEmbed.addField('ID:', user.id, true);
			banNotificationEmbed.addField('REASON:', banReason);
			banNotificationEmbed.addField('ISSUED BY:', `${message.author.username}#${message.author.discriminator}`);
			banNotificationEmbed.setColor('#fc1717');			
			banNotificationEmbed.setTimestamp();
			      
			//anounce banNotification to a channel in the CFG
    });
}