//handles the banning of a user
const Discord = require('discord.js');
const { getUserObjectByNameOrID, sendMessageToChannel } = require('../resources/utils');



module.exports = {
	name: 'ban',
	aliases: ['fox2','foxtwo','getrekt','destroy','b'],
	description: 'Bans user(s) in its arguements with an optional reason arguement',
    usage: '-user(s) -reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
	async execute(client, args, message) {

		let usersToBan = [];
		let banReason = '';

		while(args.length > 0){
			let currArg = args.shift().trim();
			let userObj = await getUserObjectByNameOrID(client, currArg, message.guild, message.channel);

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
			return;
		}  

		console.log(`Banning ${usersToBan} for reason: ${banReason}`);
  
		if(banReason.length <= 0) banReason = "No reason specified";

		usersToBan.forEach(async (user) => {						
			try {
				let banEmbed = new Discord.MessageEmbed();
				banEmbed.setAuthor(`${user.username}#${user.discriminator}`);
				banEmbed.setThumbnail(user.avatarURL());
				banEmbed.setTitle(`M.O.H. Citation - [BANNED]`);
				banEmbed.setDescription('**Reason:** ' + banReason);
				banEmbed.setColor('#c22f2f');
				banEmbed.setFooter(`USER ID: ${user.id}`);
				banEmbed.setTimestamp();

				await user.send(`You have banned from **${message.guild.name}** \nReason: ${banReason}`);
				//await message.guild.members.ban(user, { banReason });	
				message.channel.send(banEmbed);
			} catch (error) {
				return sendMessageToChannel(`Failed to ban: ${user.name}\nError: ${error}`, message.channel);
			}
		});
	},
};