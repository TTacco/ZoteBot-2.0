const Discord = require('discord.js');
const { getGuildMemberByNameOrID, getUserByID } = require('../utils/helper-functions.js');
const { addUserLog } = require('../utils/database-query-helper.js');

module.exports = {
    name: 'note',
    aliases: ['n'],
	description: 'Warns a user',
    usage: '-user -reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        
        let userToNote = args.shift();
        let noteReason = args.join(' ');

        const guildMember = await getGuildMemberByNameOrID(userToNote, message.guild);
        let user = guildMember['user'] || await getUserByID(userToWarn);
        if (!user) {
            message.reply("User specified does not exist, make sure it's in the correct format");
            return;
        }

        if(noteReason.length < 1){
            noteReason = 'No reason specified';
        }

        try {
			//await message.guild.members.ban(user, { banReason });	//THE actual kill command.

            let noteToChannelEmbed = new Discord.MessageEmbed();
            noteToChannelEmbed.setTitle('M.O.H. Citation - Surveilance Record');
            noteToChannelEmbed.setThumbnail(user.avatarURL());
            noteToChannelEmbed.addFields(
                { name: 'USER:', value: `${user.username}#${user.discriminator}`, inline: true },
                { name: 'ID:', value: user.id, inline: true },
                { name: 'PENALTY', value: 'Warn', inline: true },
                { name: 'REASON', value: noteReason},
                { name: 'ISSUED BY:', value: `${message.author.username}#${message.author.discriminator}`},
            );
            noteToChannelEmbed.setColor('#4287f5');			
            noteToChannelEmbed.setTimestamp();
            message.channel.send(noteToChannelEmbed);
        } catch (error) {
            return message.reply(`Failed to warn: ${user.name}\nError: ${error}`, message.channel);
        }

        let logInfo = {
            log_type: "NOTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: noteReason,
            log_moderator: message.author.username+'#'+message.author.discriminator,
            log_user_id: user.id, 
        };

        addUserLog(logInfo);

    }
}