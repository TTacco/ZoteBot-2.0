const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID, ISODateFormatter} = require('../utils/helper-functions.js');

module.exports = {
    name: 'identify',
	aliases: ['i','inspect','whois'],
	description: 'Identifies a user and their information',
    usage: '<COMMAND NAME|ALIAS> <USER>',
    example: 'whois User#1234',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        //Parse string to see if its a user
        let currArg = args[0];
		const guildMember = await getGuildMemberByNameOrID(currArg, message.guild) || await getUserByID(currArg);
        if (!guildMember) {
            return ["User specified does not exist, make sure it's in the correct format"];
        }

        const user = guildMember.user;
        const memberRoles = guildMember.roles.member._roles;
        const serverRoles = [...guildMember.guild.roles.cache.values()];
        let memberRolesToDisplay = serverRoles.filter((role) => {
            return memberRoles.includes(role.id);           
        });

        //Date formatter
        let createdAtFormatted = ISODateFormatter(user.createdAt, true);
        let joinedAtDateFormatted = ISODateFormatter(guildMember.joinedAt, true);

        //Embed
        let identifyEmbed = new Discord.MessageEmbed();
        identifyEmbed.setTitle('K.O.H. Observation Details');
        identifyEmbed.setThumbnail(user.avatarURL());
        identifyEmbed.addFields(
            { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
            { name: 'ID:', value: user.id, inline: true},
            { name: 'NICKNAME:', value: `${guildMember.nickname ? guildMember.nickname : 'N/A'}`},
            { name: 'CREATED AT:', value: `${createdAtFormatted}`, inline: true},
            { name: 'JOINED AT:', value: `${joinedAtDateFormatted}`, inline: true},
            { name: 'ROLES:', value: `${memberRolesToDisplay.join(' ') || "No Roles"}`},
        );
        identifyEmbed.setColor('#6ba605');
        return [identifyEmbed];
    }
}