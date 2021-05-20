const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID} = require('../resources/helperFunctions');

//handles the banning of a user
module.exports = {
	name: 'ban',
	aliases: ['fox2','foxtwo','getrekt','destroy','b'],
	description: 'Bans user(s) in its arguements with an optional reason arguement',
    usage: '-user(s) -reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
	async execute(args, message) {

		let usersToBan = [];
		let banReason = '';

		while(args.length > 0){
			let currArg = args.shift().trim();
			let userObj = await getGuildMemberByNameOrID(currArg, message.guild) || await getUserByID(currArg);

			//Discord 
			if(userObj){
				usersToBan.push(userObj);
			}
			//Assume that the arguement lists for the users is finished, and the rest is the ban reason
			else{
				banReason = currArg + ' ' + args.join(' ');
				break;
			}		
		}

		if(usersToBan.length < 1) {
			message.reply("User(s) specified does not exist, make sure it's in the correct format");
			return;
		}  

		console.log(`Banning ${usersToBan} for reason: ${banReason}`);
  
		if(banReason.length <= 0) banReason = "No reason specified";

		usersToBan.forEach(async (user) => {						
			try {
				await message.guild.members.ban(user);						
			} catch (error) {
				return message.reply(`Error: ${error}`);
			}

			try{
				//TODO refactor as its own js file
				let banChannelEmbed = new Discord.MessageEmbed();
				banChannelEmbed.setTitle('M.O.H. Citation - Protocol Violated');
				banChannelEmbed.setThumbnail(user.avatarURL());
				banChannelEmbed.addField(`USER:`,`${user.username}#${user.discriminator}`, true);
				banChannelEmbed.addField('ID:', user.id, true);
				banChannelEmbed.addField('PENALTY:', 'Ban', true);
            	banChannelEmbed.addField('REASON:', banReason);
				banChannelEmbed.addField('ISSUED BY:', `${message.author.username}#${message.author.discriminator}`);
				banChannelEmbed.setColor('#fc1717');			
				//banChannelEmbed.setFooter(`USERID: ${user.id}`);
				banChannelEmbed.setTimestamp();

				message.channel.send(banChannelEmbed);

				let banUserEmbed = new Discord.MessageEmbed();
				banUserEmbed.setTitle(`You have been banned from ${message.guild.name}`);
            	banUserEmbed.addField('Reason:', banReason);
				banUserEmbed.setColor('#fc1717');
				await user.send(banUserEmbed);		
			} catch (error) {
				return message.reply(`Error: ${error}`);
			}
		});
	},
};