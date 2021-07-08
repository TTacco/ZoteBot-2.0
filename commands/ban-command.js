const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID} = require('../utils/helper-functions.js');

//handles the banning of a user
module.exports = {
	name: 'ban',
	aliases: ['fox2','foxtwo','getrekt','destroy','b'],
	description: 'Bans user (or multiple users) in its arguements by a given (optional) arguement',
    usage: '<COMMAND NAME|ALIAS> <USER(s)> <REASON?>',
	example: "ban 000000000000000001 User#1234 both of you are banned" ,
    args: true,
    guildOnly: true,
    cooldown: 3,
	async execute(args, message) {

		let guildMembersToBan = [];
		let banReason = '';
		let executionResults = [];

		const guild = message.guild;
		/*
		Keep going through the args list to get all specified user IDs to be banned
		This is done to allow mass banning multiple users, stop the moment the current arguement
		can no longer be parsed as an ID
		*/
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

		//There was no detected/parsed specified users to be banned in the list
		if(guildMembersToBan.length < 1) {
			return ["User(s) specified does not exist, make sure it's in the correct format"];
		}  

		if(banReason.length <= 0) banReason = "No reason specified";
		console.log(`Banning ${guildMembersToBan} for reason: ${banReason}`);

		
		var botRole = guild.roles.cache.find(role => role.name === "ZoteBot");
		//Loop through each of the members to be banned
		guildMembersToBan.forEach(async (gm) => {	
			let user = gm['user'];
			if(gm.roles.highest.position >= botRole.position){
				executionResults.push(`Unable to ban ${user.username}#${user.discriminator} due to them having a higher or equal role position`);
				return;
			}

			try {
				//await message.guild.members.ban(user);						
			} catch (error) {
				executionResults.push(`Failed to ban ${user.username} `, error);
				return;
			}
		
			//Ban notification for the channel
			let banNotificationEmbed = new Discord.MessageEmbed();
			banNotificationEmbed.setTitle('K.O.H. Proclamation of Exile');
			banNotificationEmbed.setThumbnail(user.avatarURL());
			banNotificationEmbed.addField(`USER:`,`${user.username}#${user.discriminator}`, true);
			banNotificationEmbed.addField('ID:', user.id, true);
			banNotificationEmbed.addField('PENALTY:', 'Ban', true);
			banNotificationEmbed.addField('REASON:', banReason);
			banNotificationEmbed.addField('ISSUED BY:', `${message.author.username}#${message.author.discriminator}`);
			banNotificationEmbed.setColor('#7e34fa');			
			banNotificationEmbed.setTimestamp();
			executionResults.push(banNotificationEmbed);

			//Ban message to the user DMs
			try{
				let banToUserEmbed = new Discord.MessageEmbed();
				banToUserEmbed.setTitle(`You have been banned from ${message.guild.name}`);
            	banToUserEmbed.addField('Reason:', banReason);
				banToUserEmbed.setColor('#7e34fa');
				await user.send(banToUserEmbed);		
			} catch (error) {
				executionResults.push(`Failed to send a ban notice to ${user.name}, recipient has most likely disabled DMs/blocked the bot.`);
			}
		});

		return executionResults;
	},
};