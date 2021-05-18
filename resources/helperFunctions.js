//Finds the user via ID or via name tag and returns the user class
async function getGuildMemberByNameOrID(message, userToSearch, guild, channelOrigin){
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
		message.channel.reply("User not found, please use the format of 'USER#0000' or make sure the ID set correctly"); 				
	}

	return guildMember;
}

var getSecondMult = function(){
    return 1000;
}
var getMinuteMult = function(){
    return 60 * getSecondMult();
}
var getHourMult = function(){
    return 60 * getMinuteMult();
}
var getDayMult = function(){
    return 24 * getHourMult();
}
var getTimeFormatMultiplier = function(format){
    if(/^(d(ays?)?)$/.test(format)){
        return getDayMult();
    }
    else if(/^(h(ours?)?)$/.test(format)){
        return getHourMult();
    }
    else if(/^(m(in(utes?)?s?)?)$/.test(format)){
        return getMinuteMult();
    }
    else if(/^(s(ec(onds?)?)?)$/.test(format)){
        return getSecondMult();
    }
    else{
        return 0;
    }
}

//sleep/wait function
async function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
    getGuildMemberByNameOrID,
	sleep,
	getSecondMult,
    getMinuteMult,
    getHourMult, 
    getDayMult,
    getTimeFormatMultiplier
}