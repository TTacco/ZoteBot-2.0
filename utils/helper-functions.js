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
			if(guild && /^.*#[0-9]{4}$/.test(userToSearch)){
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
		console.log(`GuildMember ${guildMember} not found in partials`);
		return null;			
	}
	else{
		console.log(`GuildMember ${guildMember} found`);
		return guildMember;
	}
}

async function getUserByID(userToSearch){
	//Gets the user object by using the fetch command itself, allowing it to get from cache
	let user;
	console.log(`Fetching user ${userToSearch}`);
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

function ISODateFormatter(dateISO, getTimeAgo = false){
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let dateObj = new Date(dateISO);

	let formattedDate = `${monthNames[dateObj.getMonth()]}-${dateObj.getDate()}-${dateObj.getFullYear()} [${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}]`;
	let msDiff = Date.now() - dateObj.getTime();
	//Time is less than a minute
	if(getTimeAgo){
		if(msDiff < 60000){
			formattedDate += `\n${Math.floor(msDiff/1000)} second(s) ago`;
		}
		//Time is less than an hour
		else if(msDiff < 3.6e+6){
			formattedDate += `\n${Math.floor(msDiff/60000)} minute(s) ago`;
		}
		//Time is less than a day
		else if(msDiff < 8.64e+7){
			formattedDate += `\n${Math.floor(msDiff/3.6e+6)} hour(s) ago`;
		}
		else if(msDiff < 2.592e+9){
			formattedDate += `\n${Math.floor(msDiff/8.64e+7)} day(s) ago`;
		}
	}	

	return formattedDate;
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
	ISODateFormatter,
}