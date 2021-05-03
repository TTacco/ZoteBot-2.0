const { Client } = require("discord.js");

module.exports = {
    //Finds the user via ID or via name tag and returns the user class
    async getUserObjectByNameOrID(guildMembers, useridentification, channelOrigin){
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		let userObj;
		try{
			if(/^<?!?[0-9]{18}>?$/.test(useridentification)){
				let cleanedID = useridentification.replace(/[<>!@]/g, '').trim();
				
				userObj = guildMembers.find(member => {
					if(member['user'].id === cleanedID) return member;
				});			
			}
			else{
				userObj = guildMembers.find(member => {
					let fullUsername = member['user'].username + '#' + member['user'].discriminator;
					if(fullUsername === useridentification) return member;
				});		
			}		
		}
		catch(error){	
			console.log(error);
		}		
	
		//Check if a user was acquired;
		if(userObj == null) {
			channelOrigin.send("User not found \nPlease use the format of 'USER#0000' or make sure the ID set correctly"); 				
		}
		else{
			channelOrigin.send(`User ${userObj['user'].username} has been found!`);
		}

        return userObj;
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