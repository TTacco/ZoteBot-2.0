module.exports = {
    name: 'unban',
	description: 'Unbans a user',
    async execute(args, message) {
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
        try {
            await message.guild.members.unban(args[0]);
            return channel.send(`Successfully unbanned <@${args[0]}>`);

        } catch (error) {
            let errorMessage = `Failed to unban. Error: **${error}**\n`
            if(error == 'DiscordAPIError: Unknown Ban'){
                errorMessage += `Most likely you gave an incorrect syntax, make sure the ID is correct.`;
            }
            else if(error == 'DiscordAPIError: Unknown User'){
                errorMessage += `User either doesn't exist or is already unbanned from the server.`;
            }
            message.reply(errorMessage);
        }

        //Embed
        try {
            

            let unbanEmbed = new Discord.MessageEmbed();
            unbanEmbed.setAuthor(`${guildMember['user'].username}#${guildMember['user'].discriminator}`);
            unbanEmbed.setThumbnail(guildMember['user'].avatarURL());
            unbanEmbed.setTitle(`M.O.H. Citation - [UNBANNED]`);
            unbanEmbed.setColor('#ff8103');
            unbanEmbed.setFooter(`USERID: ${guildMember['user'].id}`);
            unbanEmbed.setTimestamp();

            await guildMember.send(`You have been unbanned in **${message.guild.name}**`);
            message.channel.send(unbanEmbed);
        } catch (error) {
            return message.channel.send(err);
        }
    }
}