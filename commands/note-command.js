const Discord = require('discord.js');
const { getGuildMemberByNameOrID, getUserByID } = require('../utils/helper-functions.js');
const { addUserLog } = require('../utils/database-query-helper.js');

module.exports = {
    name: 'note',
    aliases: ['n'],
	description: `Places a note in the user's log without notifying them`,
    usage: '<COMMAND NAME|ALIAS> <NOTE>',
    example: 'note for being a sussy baka',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        
        let userToNote = args.shift();
        let noteReason = args.join(' ');
        let executionResults = [];

        const guildMember = await getGuildMemberByNameOrID(userToNote, message.guild);
        let user = guildMember['user'] || await getUserByID(userToWarn);
        if (!user) {
            return "User specified does not exist, make sure it's in the correct format";
            return;
        }

        if(noteReason.length < 1){
            return 'Cannot note someone without any specified reasons';
        }
        let noteToChannelEmbed = new Discord.MessageEmbed();
        noteToChannelEmbed.setTitle('K.O.H. Proclamation of Awareness');
        noteToChannelEmbed.setThumbnail(user.avatarURL());
        noteToChannelEmbed.addFields(
            { name: 'USER:', value: `${user.username}#${user.discriminator}`, inline: true },
            { name: 'ID:', value: user.id, inline: true },
            { name: 'PENALTY', value: 'Note', inline: true },
            { name: 'REASON', value: noteReason},
            { name: 'ISSUED BY:', value: `${message.author.username}#${message.author.discriminator}`},
        );
        noteToChannelEmbed.setColor('#d9cb04');			
        noteToChannelEmbed.setTimestamp();

        executionResults.push(noteToChannelEmbed);

        let logInfo = {
            log_type: "NOTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: noteReason,
            log_moderator: message.author.username+'#'+message.author.discriminator,
            log_user_id: user.id, 
        };

        addUserLog(logInfo);

        return executionResults;

    }
}