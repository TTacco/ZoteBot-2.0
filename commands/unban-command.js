const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID} = require('../utils/helper-functions.js');

module.exports = {
    name: 'unban',
    aliases: ['ub'],
	description: 'Unbans a user',
    usage: '<COMMAND NAME|ALIAS> <USER>',
	example: 'unban User#1234',
    async execute(args, message) {
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
        let executionResults = [];
        let targetUser = args.shift();
        const guild = message.guild;
  
        let guildMember = await getGuildMemberByNameOrID(targetUser, guild);
        if (!guildMember) {
            return "User specified does not exist, make sure it's in the correct format";
        }
        let user = guildMember['user'];

        try {
            await message.guild.members.unban(guildMember) || await getUserByID(guildMember);
        } 
        catch (error) {
            return `User either doesn't exist or is already unbanned from the server.`;
        }

        let unbanEmbed = new Discord.MessageEmbed();
        unbanEmbed.setAuthor(`${user.username}#${user.discriminator}`);
        unbanEmbed.setThumbnail(user.avatarURL());
        unbanEmbed.setTitle(`K.O.H. Proclamation of Absolvation`);
        unbanEmbed.setColor('#c95fb9');
        unbanEmbed.setFooter(`USERID: ${user.id}`);
        unbanEmbed.setTimestamp();
        executionResults.push(unbanEmbed);

        try{
            let unbanDMEmbed = new Discord.MessageEmbed();
            unbanDMEmbed.setTitle(`You have been unbanned from **${message.guild.name}**`);
            unbanDMEmbed.setColor('#c95fb9');

            await guildMember.send(unbanDMEmbed);
        }
        catch(error){
            executionResults.push(`Failed to send unban notice to ${guildMember.name}, recipient has most likely disabled DMs/blocked the bot.`)
        }

        return executionResults;
    }
}