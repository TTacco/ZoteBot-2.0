const { client } = require('../index.js');

//Finds the user via ID or via name tag and returns the user class
async function getGuildMemberByNameOrID(userToSearch, guild){
	//Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
	userToSearch = ('' + userToSearch).trim();
	let guildMember;
	try{
		//Check if the user queried is an ID of the format <@!000000000000000000>
		if(/^(<@)?!?([0-9]{18})(>)?$/.test(userToSearch)){
			let cleanedID = userToSearch.replace(/[<>!@]/g, '').trim();

			guildMember = guild.members.cache.get(cleanedID);
		}
		//Check if the user queried is a name of the format NAME#0000, find the closest similar name to it
		else{
			if(/^.*#[0-9]{4}$/.test(userToSearch)){
				guildMember = guild.members.cache.find(user => {		
					let tagname = user['user'].username + '#' + user['user'].discriminator;
					return tagname === userToSearch;
				});
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
		return null;			
	}

	console.log(`GUILDMEMBER ${guildMember}`)
	return guildMember;
}

async function getUserByID(userToSearch){
	//Gets the user object
	let user;
	console.log(userToSearch);
	try{
		//Check if the user queried is an ID of the format <@!000000000000000000>
		if(/^(<@)?!?([0-9]{18})(>)?$/.test(userToSearch)){
			let cleanedID = userToSearch.replace(/[<>!@]/g, '').trim();
			user = await client.users.fetch(cleanedID); 
		}
		else{
			return null;
		}
	}
	catch(err){
		console.log(err);
		return null;
	}
	return user;
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
	getUserByID,
	sleep,
	getSecondMult,
    getMinuteMult,
    getHourMult, 
    getDayMult,
    getTimeFormatMultiplier,
}