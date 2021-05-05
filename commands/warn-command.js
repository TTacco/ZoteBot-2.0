const Discord = require('discord.js');
const { getUserObjectByNameOrID, sendMessageToChannel } = require('../resources/utils');

module.exports = {
    name: 'warn',
    aliases: ['w'],
	description: 'Warns the user including an optional arguement',
    usage: '-user -reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(client, arguements, message) {
        
        let userToWarn = arguements.shift();
        let warnReason = arguements.join(' ');

        let user = await getUserObjectByNameOrID(client, userToWarn, message.guild, message.channel);
        if (!user) {
            return;
        }

        if(warnReason.length < 1){
            warnReason = 'No reason specified';
        }

        try {
            let warnEmbed = new Discord.MessageEmbed();
            warnEmbed.setAuthor(`${user.username}#${user.discriminator}`);
            warnEmbed.setThumbnail(user.avatarURL());
            warnEmbed.setTitle(`M.O.H. Citation - [WARNED]`);
            warnEmbed.setDescription('**Reason:** ' + warnReason);
            warnEmbed.setColor('#e3c022');
            warnEmbed.setFooter(`USER ID: ${user.id}`);
            warnEmbed.setTimestamp();

            await user.send(`You have warned been from **${message.guild.name}** \nReason: ${warnReason}`);
            message.channel.send(warnEmbed);
        } catch (error) {
            return sendMessageToChannel(`Failed to warn: ${user.name}\nError: ${error}`, message.channel);
        }

    }
}