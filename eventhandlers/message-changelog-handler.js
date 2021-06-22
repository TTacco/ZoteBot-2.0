const Discord = require('discord.js');
const { client } = require('../index.js');
const config = require("../config.json");



if(config.messageChangelogSettings.enabled){
    let channelsToSend = config.messageChangelogSettings.messageChangelogChannelID;
    client.on('messageUpdate', (oldMessage, newMessage) => {
        if(oldMessage.author.bot) return;
        console.log(`Message was edited \nOriginal: "${oldMessage}"\nNew: "${newMessage}" `);
        try {
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
                channelDestination.send(messageUpdateEmbed);
            }
        } catch (error) {
            console.error('FAILED TO SEND MESSAGE CHANGELOG EMBED - EDIT', error);
        }


    
    });
    
    client.on('messageDelete', (deletedMessage) => {
        if(deletedMessage.author.bot) return;
        console.log(`Message was deleted ${deletedMessage}`);
        try {
            for(let i = 0; i<channelsToSend.length; i++){
                let channelDestination = client.channels.cache.get(channelsToSend[i]);
                let messageDeletedEmbed = new Discord.MessageEmbed();
                messageDeletedEmbed.setTitle('Message Updated');
                messageDeletedEmbed.setAuthor(`${deletedMessage.author.username}#${deletedMessage.author.discriminator}`, deletedMessage.author.avatarURL());
                messageDeletedEmbed.addFields(
                    { name: 'DELETED: ', value: deletedMessage, inline: true},
                );
                messageDeletedEmbed.setColor('#e00f00');			
                channelDestination.send(messageDeletedEmbed);
            }
        } catch (error) {
            console.error('FAILED TO SEND MESSAGE CHANGELOG EMBED - DELETE', error);
        }

    });
}