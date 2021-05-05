//handles the banning of a user
const Discord = require('discord.js');
const { getUserObjectByNameOrID, sendMessageToChannel } = require('../resources/utils');

module.exports = {
	async banUsers(client, args, message) {

		//!ban 2347239479237492 i just wanted to
		//console.log(members);
		let usersToBan = [];
		let banReason = '';

		while(args.length > 0){
			let currArg = args.shift().trim();
			let userObj = await getUserObjectByNameOrID(client, currArg, message.guild, message.channel);

			if(userObj){
				usersToBan.push(userObj);
			}
			else{
				//Assume that the arguement lists for the users is finished
				banReason = currArg + ' ' + args.join(' ');
				break;
			}
			
		}

		console.log(`Banning ${usersToBan} for reason ${banReason}`);

		if(usersToBan.length < 1) {
			sendMessageToChannel('No specified users found in the arguement', message.channel);
			return;
		}  

		if(banReason.length <= 0) banReason = "No reason given";

		usersToBan.forEach(async (user) => {						
			try {
				let banEmbed = new Discord.MessageEmbed();
				banEmbed.setAuthor(`USER: ${user.username}#${user.discriminator}`);
				banEmbed.setThumbnail(await user.avatarURL());
				banEmbed.setTitle(`USER HAS BEEN BANNED`);
				banEmbed.setDescription('Reason: ' + banReason);
				banEmbed.setColor('#FF1111');
				banEmbed.setFooter(`User ID: ${user.id}`);
				banEmbed.setTimestamp();

				await user.send(`You have banned from **${message.guild.name}** \nReason: ${banReason}`);
				//await message.guild.members.ban(user, { banReason });	
				message.channel.send(banEmbed);
			} catch (error) {
				return sendMessageToChannel(`Failed to ban: ${user.name}\nError: ${error}`, message.channel);
			}
		});
	},

	async unBanUser(client, arguements, [channel, guild]) {
		//Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		try {
			await guild.members.unban(arguements[0]);
			return channel.send(`Successfully unbanned <@${arguements[0]}>`);
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