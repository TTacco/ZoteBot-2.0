const Discord = require('discord.js');
const { getGuildMemberByNameOrID, getUserByID } = require('../utils/helper-functions');
const { addUserLog } = require('../utils/database-query-helper');

module.exports = {
    name: 'warn',
    aliases: ['w'],
	description: 'Warns a user for a given reason',
    usage: '<COMMAND NAME|ALIAS> <USER> <REASON>',
    example: 'w User#1234 stop among us posting',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        
        let userToWarn = args.shift();
        let warnReason = args.join(' ');

        const guildMember = await getGuildMemberByNameOrID(userToWarn, message.guild);
        let user = guildMember['user'] || await getUserByID(userToWarn);
        if (!user) {
            message.reply("User specified does not exist, make sure it's in the correct format");
            return;
        }

        if(warnReason.length < 1){
            warnReason = 'No reason specified';
        }

        try {
			//await message.guild.members.ban(user, { banReason });	//THE actual kill command.

            let warnChannelEmbed = new Discord.MessageEmbed();
            warnChannelEmbed.setTitle('K.O.H. Proclamation of Caution');
            warnChannelEmbed.setThumbnail(user.avatarURL());
            warnChannelEmbed.addFields(
                { name: 'USER:', value: `${user.username}#${user.discriminator}`, inline: true },
                { name: 'ID:', value: user.id, inline: true },
                { name: 'PENALTY', value: 'Warn', inline: true },
                { name: 'REASON', value: warnReason},
                { name: 'ISSUED BY:', value: `${message.author.username}#${message.author.discriminator}`},
            );
            warnChannelEmbed.setColor('#ff8317');			
            warnChannelEmbed.setTimestamp();
            message.channel.send(warnChannelEmbed);
    
            let warnUserEmbed = new Discord.MessageEmbed();
            warnUserEmbed.setTitle(`You have been warned from ${message.guild.name}`);
            warnUserEmbed.addField('Reason:', warnReason);
            warnUserEmbed.setColor('#d98404');
            await user.send(warnUserEmbed);
        } catch (error) {
            return message.reply(`Failed to warn: ${user.name}\nError: ${error}`, message.channel);
        }

        let logInfo = {
            log_type: "WARN",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: warnReason,
            log_moderator: message.author.username+'#'+message.author.discriminator,
            log_user_id: user.id, 
        };

        addUserLog(logInfo);

    }
}