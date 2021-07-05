const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID} = require('../resources/helper-functions.js');

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

		let guildMembersToBan = [];
		let banReason = '';
		let executionResults = [];

		while(args.length > 0){
			let currArg = args.shift().trim();
			let guildMember = await getGuildMemberByNameOrID(currArg, message.guild) || await getUserByID(currArg);

			if(guildMember){
				guildMembersToBan.push(guildMember);
			}
			//Assume that the arguement lists for the users is finished, and the rest is the ban reason
			else{
				banReason = currArg + ' ' + args.join(' ');
				break;
			}		
		}

		if(guildMembersToBan.length < 1) {
			return ["User(s) specified does not exist, make sure it's in the correct format"];
		}  

		console.log(`Banning ${guildMembersToBan} for reason: ${banReason}`);
  
		if(banReason.length <= 0) banReason = "No reason specified";

		guildMembersToBan.forEach(async (gm) => {	
			let user = gm['user'];
			try {
				//await message.guild.members.ban(user);						
			} catch (error) {
				executionResults.push(`Failed to ban ${user.name} `, error);
				return;
			}
		
			//Ban notification for the channel
			let banNotificationEmbed = new Discord.MessageEmbed();
			banNotificationEmbed.setTitle('M.O.H. Citation - Protocol Violated');
			banNotificationEmbed.setThumbnail(user.avatarURL());
			banNotificationEmbed.addField(`USER:`,`${user.username}#${user.discriminator}`, true);
			banNotificationEmbed.addField('ID:', user.id, true);
			banNotificationEmbed.addField('PENALTY:', 'Ban', true);
			banNotificationEmbed.addField('REASON:', banReason);
			banNotificationEmbed.addField('ISSUED BY:', `${message.author.username}#${message.author.discriminator}`);
			banNotificationEmbed.setColor('#fc1717');			
			banNotificationEmbed.setTimestamp();
			executionResults.push(banNotificationEmbed);

			//Ban message to the user DMs
			try{
				let banToUserEmbed = new Discord.MessageEmbed();
				banToUserEmbed.setTitle(`You have been banned from ${message.guild.name}`);
            	banToUserEmbed.addField('Reason:', banReason);
				banToUserEmbed.setColor('#fc1717');
				await user.send(banToUserEmbed);		
			} catch (error) {
				executionResults.push(`Failed to notify ${user.name}`);
			}
		});

		return executionResults;
	},
};