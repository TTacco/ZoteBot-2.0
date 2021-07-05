const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID, ISODateFormatter} = require('../resources/helper-functions.js');

module.exports = {
    name: 'identify',
	aliases: ['whois','i','inspect'],
	description: 'Identifies a user and their information',
    usage: '-user',
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

        //Guild name ~ guildMember.displayName
        //Tag name ~ user.name + user.discriminator
        //ID ~ user.id 
        //Join Date ~ guildMember.joinedAt
        //Registration date ~ user.createdAt
        //Roles ~ guildMember.roles

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
        identifyEmbed.setTitle('K.O.H. Request - User Info');
        identifyEmbed.setThumbnail(user.avatarURL());
        identifyEmbed.addFields(
            { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
            { name: 'ID:', value: user.id, inline: true},
            { name: 'NICKNAME:', value: `${guildMember.nickname ? guildMember.nickname : 'N/A'}`},
            { name: 'CREATED AT:', value: `${createdAtFormatted}`, inline: true},
            { name: 'JOINED AT:', value: `${joinedAtDateFormatted}`, inline: true},
            { name: 'ROLES:', value: `${memberRolesToDisplay.join(' ')}`},
        );
        identifyEmbed.setColor('#67ad0a');
        return [identifyEmbed];
    }
}