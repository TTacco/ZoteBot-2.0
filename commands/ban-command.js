//handles the banning of a user
const Discord = require('discord.js');

module.exports = {
	banUser(client, channel, arguements) {

		let user = null;

		//Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		if(/\b([0-9]{18})\b/.test(arguements[0]))
			user = client.users.cache.get(arguements[0]);
		else
			user = client.users.cache.find(u => u.tag === arguements[0]);

		//If user is not found then warn the channel the message it was sent that their format is probably wrong
		if(user == null) {
			try{
				channel.send("User not found \n Please use the format of 'USER#0000' or make sure the ID set correctly")
			}
			catch(error){
				console.log('Unable to send message the channel');
			}
			return
		};

		//Make this modifiable later to point where to log this ban
		arguements.shift();
		let banReason = arguements.join('');

		let banEmbed = new Discord.MessageEmbed();
        banEmbed.setAuthor(`USER: ${user.username}#${user.discriminator}`);
		banEmbed.setThumbnail(user.avatarURL());
        banEmbed.setTitle(`<<Bandit has been splashed!>>`);
        banEmbed.setDescription('Reason: ' + banReason);
        banEmbed.setColor('#FF1111');
        banEmbed.setTimestamp();
        channel.send(banEmbed);
	},
};