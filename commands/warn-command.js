const Discord = require('discord.js');
const { getGuildMemberByNameOrID, sendMessageToChannel } = require('../resources/utils');

module.exports = {
    name: 'warn',
    aliases: ['w'],
	description: 'Warns a user',
    usage: '-user -reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        
        let userToWarn = args.shift();
        let warnReason = args.join(' ');

        let user = await getGuildMemberByNameOrID(message.client, userToWarn, message.guild, message.channel)['user'];
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