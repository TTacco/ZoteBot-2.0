const { Client } = require("discord.js");

//Finds the user via ID or via name tag and returns the user class
async function getGuildMemberByNameOrID(client, userToSearch, guild, channelOrigin){
	//Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
	let guildMember;
	console.log(userToSearch);
	try{
		//Check if the user queried is an ID of the format <@!000000000000000000>
		if(/^(<@)?!?([0-9]{18})(>)?$/.test(userToSearch)){
			let cleanedID = userToSearch.replace(/[<>!@]/g, '').trim();
			guildMember = guild.members.cache.find(user => {		
				let userID = user['user'].id;
				return userID === cleanedID;
			});
		}
		//Check if the user queried is a name of the format NAME#0000, find the closest similar name to it
		else{
			if(/^.*#[0-9]{4}$/.test(userToSearch)){
				guildMember = guild.members.cache.find(user => {		
					let tagname = user['user'].username + '#' + user['user'].discriminator;
					return tagname === userToSearch;
				});

				//console.log(guildMember);
				//guildMember = guildMember['user'];
			}
			/* Make a JSON file to enable/disable ban by nickname feature
			else{
				let userCollection = await guild.members.fetch({query: userToSearch, limit: 1});
				if(userCollection != null)
					guildMember = userCollection.first()['user'];
			}
			*/
		}		
	}
	catch(error){	
		console.log(error);
	}		

	//Check if a user was acquired;
	if(!guildMember) {
		channelOrigin.send("User not found, please use the format of 'USER#0000' or make sure the ID set correctly"); 				
	}
	else{
		//channelOrigin.send(`User ${guildMember} has been found!`);
	}	

	return guildMember;
}

//Send a warning to the channel remove this later
async function sendMessageToChannel(message, channel){
	try{
		await channel.send(message)
	}
	catch(error){
		console.log('Unable to send message to the channel');
	}
	return
}

//sleep/wait function
async function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function giveTemporaryRole(message, recipient, roleToGive, duration){
	try{
		var role = message.guild.roles.cache.find(role => role.name === roleToGive);
		var botRole = message.guild.roles.cache.find(role => role.name === "ZoteBot");

		//Make another restricted roles list to dynamically disallow this
		if(roleToGive == 'Muted' && recipient.roles.highest.position > botRole.position){
			message.reply("Unable to mute the user due to them having a higher role position");
			return;
		}

		recipient.roles.add(role);
		await sleep(duration);
		recipient.roles.remove(role);
	}
	catch(err){
		console.log(err);
		return;
	}
}

module.exports = {
    getGuildMemberByNameOrID,
	sendMessageToChannel,
	sleep,
	giveTemporaryRole,
}