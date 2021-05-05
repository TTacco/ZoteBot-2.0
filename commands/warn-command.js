const Discord = require('discord.js');
const { getUserObjectByNameOrID, sendMessageToChannel } = require('../resources/utils');

module.exports = {
    name: 'warn',
	description: 'Warns the user including an optional arguement',
    async execute(client, arguements, message) {
        
        let userToWarn = arguements.shift();
        let warnReason = arguements.join(' ');

        let user = await getUserObjectByNameOrID(client, userToWarn, message.guild, message.channel);
        if (!user) {
            message.channel.send('No user found');
            return;
        }

        if(warnReason.length < 1){
            warnReason = 'No reason specified';
        }

        console.log(user);
        try {
            let warnEmbed = new Discord.MessageEmbed();
            warnEmbed.setAuthor(`USER: ${user.username}#${user.discriminator}`);
            warnEmbed.setThumbnail(user.avatarURL());
            warnEmbed.setTitle(`User Warned`);
            warnEmbed.setDescription('Reason: ' + warnReason);
            warnEmbed.setColor('#fcb103');
            warnEmbed.setFooter(`User ID: ${user.id}`);
            warnEmbed.setTimestamp();

            await user.send(`You have warned from **${message.guild.name}** \nReason: ${warnReason}`);
            message.channel.send(warnEmbed);
        } catch (error) {
            return sendMessageToChannel(`Failed to warn: ${user.name}\nError: ${error}`, message.channel);
        }

    }
}