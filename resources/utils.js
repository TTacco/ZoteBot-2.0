const { Client } = require("discord.js");

module.exports = {
    //Finds the user via ID or via name tag and returns the user class
    async getUser(guildMembers, useridentification, channelOrigin){
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		let members;
		let user = null;
		try{
			if(/\b([0-9]{18})\b/.test(useridentification)){
				let cleanedID = useridentification.replace(/[<>!@]/g, '').trim();
				//user = client.users.cache.get(cleanedID);
				//user = await client.users.fetch(cleanedID);
			}
			else{
				console.log(client.users.cache);
				//user = client.users.cache.find(user => user.username == useridentification);
			}		
		}
		catch(error){	
			console.log(error);
		}
	
		//Check if a user was acquired;
		if(user == null) {
			module.exports.sendMessageToChannel("User not found \nPlease use the format of 'USER#0000' or make sure the ID set correctly", channelOrigin); 				return null;
		}
		else if(user.bot){
			try{
				channelOrigin.send("Unable to ban a bot");
			}	
			catch(error){
				console.log(error);
			}	
			finally{
				return null;
			}
		}

        return user;
    },

	//Send a warning to the channel
    async sendMessageToChannel(message, channel){
		try{
			await channel.send(message)
		}
		catch(error){
			console.log('Unable to send message to the channel');
		}
		return
    }
}