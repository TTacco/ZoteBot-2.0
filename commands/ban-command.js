//handles the banning of a user
const Discord = require('discord.js');

module.exports = {
	async banUser(client, arguements, [channel, guild]) {

		let user = null;

		//Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		if(/\b([0-9]{18})\b/.test(arguements[0])){
			let cleanedID = arguements[0].replace(/[<>!@]/g, ''); 
			user = client.users.cache.get(cleanedID);
		}
		else{
			user = client.users.cache.find(u => u.tag === arguements[0]);
		}


		//If user is not found then warn the channel the message it was sent that their format is probably wrong
		if(user == null) {
			try{
				channel.send("User not found \n Please use the format of 'USER#0000' or make sure the ID set correctly")
			}
			catch(error){
				console.log('Unable to send message to the channel');
			}
			return
		};

		//Make this modifiable later to point where to log this ban
		arguements.shift();
		let banReason = arguements.join(' ');
		if(banReason.length <= 0) banReason = "No reason given";

		let banEmbed = new Discord.MessageEmbed();
        banEmbed.setAuthor(`USER: ${user.username}#${user.discriminator}`);
		banEmbed.setThumbnail(user.avatarURL());
        banEmbed.setTitle(`USER HAS BEEN BANNED`);
        banEmbed.setDescription('Reason: ' + banReason);
        banEmbed.setColor('#FF1111');
		banEmbed.setFooter(`User ID: ${user.id}`);
        banEmbed.setTimestamp();
		
		try {
			await user.send(`You have banned from **${guild.name}** \nReason: ${banReason} and being a fuckin nerd LMFAO`);

			guild.members.ban(user, { banReason });
		} catch (error) {
			return channel.send(`Failed to ban: ${error}`);
		}

		return channel.send(banEmbed);
	},

	async unBanUser(client, arguements, [channel, guild]) {
		//Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		try {
			await guild.members.unban(arguements[0]);
			return channel.send(`Successfully unbanned <@${arguements[0]}>!`);
		} catch (error) {
			let errorMessage = `Failed to unban. Error: **${error}**\n`
			if(error == 'DiscordAPIError: Unknown Ban'){
				errorMessage += `Reason: Most likely you gave an incorrect syntax, make sure the ID is correct.`;
			}
			else if(error == 'DiscordAPIError: Unknown User'){
				errorMessage += `Reason: User either doesn't exist or is already unbanned from the server.`;
			}
			channel.send(errorMessage);
		}
	}
};