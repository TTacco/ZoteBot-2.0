const Discord = require('discord.js');
const { client } = require('../index.js');
const config = require("../config.json");



if(config.messageChangelogSettings.enabled){
    let channelsToSend = config.messageChangelogSettings.messageChangelogChannelID;
    client.on('messageUpdate', (oldMessage, newMessage) => {
        try {
            if(oldMessage.author.bot || !oldMessage) return;
            for(let i = 0; i<channelsToSend.length; i++){
                let channelDestination = client.channels.cache.get(channelsToSend[i]);
                let messageUpdateEmbed = new Discord.MessageEmbed();
                messageUpdateEmbed.setTitle('Message Updated');
                messageUpdateEmbed.setAuthor(`${oldMessage.author.username}#${oldMessage.author.discriminator}`, oldMessage.author.avatarURL());
                messageUpdateEmbed.addFields(
                    { name: 'OLD:', value: oldMessage},
                    { name: 'NEW:', value: newMessage},
                );
                messageUpdateEmbed.setColor('#e4e800');		
                messageUpdateEmbed.setFooter(oldMessage.author.id);
                messageUpdateEmbed.setTimestamp();	
                channelDestination.send(messageUpdateEmbed);
            }
        } catch (error) {
            console.error('FAILED TO SEND MESSAGE CHANGELOG EMBED - EDIT', error);
        }


    
    });
    
    client.on('messageDelete', (deletedMessage) => {
        try {
            if(deletedMessage.author.bot || deletedMessage == null) return;

            for(let i = 0; i<channelsToSend.length; i++){
                let channelDestination = client.channels.cache.get(channelsToSend[i]);
                let messageDeletedEmbed = new Discord.MessageEmbed();
                messageDeletedEmbed.setTitle('Message Deleted');
                messageDeletedEmbed.setAuthor(`${deletedMessage.author.username}#${deletedMessage.author.discriminator}`, deletedMessage.author.avatarURL());
                messageDeletedEmbed.addFields(
                    { name: 'DELETED: ', value: deletedMessage, inline: true},
                );
                messageDeletedEmbed.setColor('#e00f00');		
                messageDeletedEmbed.setFooter(deletedMessage.author.id);
                messageDeletedEmbed.setTimestamp();
                channelDestination.send(messageDeletedEmbed);
            }
        } catch (error) {
            console.error('FAILED TO SEND MESSAGE CHANGELOG EMBED - DELETE', error);
        }

    });
}