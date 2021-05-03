//handles the banning of a user
const Discord = require('discord.js');
const { getUser, sendMessageToChannel } = require('../resources/utils');

module.exports = {
	async banUser(client, args, [channel, guild, moderator]) {

		let user = null;
		user = getUser(client, args[0]);

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
		args.shift();
		let banReason = args.join(' ');
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
			await user.send(`You have banned from **${guild.name}** \nReason: ${banReason}`);
			await guild.members.ban(user, { banReason });
		} catch (error) {
			return channel.send(`Failed to ban: ${error}`);
		}

		return channel.send(banEmbed);
	},

	/*
		client: Discord client instance
		args: the IDs to be banned and the reason for the ban
		channel: the channel the ban command was issued from
		guild: the current server being used
		moderator: the user who initiated the ban
	*/
	async massBan(client, args, [channel, guild, moderator]) {

		let usersToBan = [];
		let banReason = '';
		while(args.length > 0){
			let arg = args.shift();
			let user = getUser(arg);

			if(user != null){
				usersToBan.push(user);
			}
			else{
				banReason = arg + ' ' + args.join(' ');  
				break;
			}			
		}

		if(usersToBan.length < 1) {
			sendMessageToChannel('No specified users found in the arguement', channel);
			return;
		}  

		if(banReason.length <= 0) banReason = "No reason given";

		let banEmbed = new Discord.MessageEmbed();

		usersToBan.forEach(user => {
        	banEmbed.setAuthor(`USER: ${user.username}#${user.discriminator}`);
			banEmbed.setThumbnail(user.avatarURL());
        	banEmbed.setTitle(`USER HAS BEEN BANNED`);
        	banEmbed.setDescription('Reason: ' + banReason);
        	banEmbed.setColor('#FF1111');
			banEmbed.setFooter(`User ID: ${user.id}`);
        	banEmbed.setTimestamp();
					
			try {
				await user.send(`You have banned from **${guild.name}** \nReason: ${banReason}`);
				//await guild.members.ban(user, { banReason });	
				channel.send(banEmbed);
			} catch (error) {
				return sendMessageToChannel(`Failed to ban: ${user.name}\nError: ${error}`, channel)
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