module.exports = {
    name: 'unban',
	description: 'Unbans user in the specified arguement',
    async execute(client, arguements, message) {
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
        try {
            await message.guild.members.unban(arguements[0]);
            return channel.send(`Successfully unbanned <@${arguements[0]}>`);
        } catch (error) {
            let errorMessage = `Failed to unban. Error: **${error}**\n`
            if(error == 'DiscordAPIError: Unknown Ban'){
                errorMessage += `Reason: Most likely you gave an incorrect syntax, make sure the ID is correct.`;
            }
            else if(error == 'DiscordAPIError: Unknown User'){
                errorMessage += `Reason: User either doesn't exist or is already unbanned from the server.`;
            }
            message.channel.send(errorMessage);
        }
    }
}