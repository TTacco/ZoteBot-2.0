const { Client } = require("discord.js");

module.exports = {
    //Finds the user via ID or via name tag and returns the user class
    async getUserObjectByNameOrID(client, userToSearch, guild, channelOrigin){
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		let userObj;
		console.log(userToSearch);
		try{
			if(/^(<@)?!?([0-9]{18})(>)?$/.test(userToSearch)){
				let cleanedID = userToSearch.replace(/[<>!@]/g, '').trim();
				userObj = await client.users.fetch(cleanedID);
			}
			else{
				let userCollection;

				if(/^.*#[0-9]{4}$/.test(userToSearch)){
					userCollection = await guild.members.fetch();
					userObj = userCollection.find(user => {
						
						 let currUser = user['user'];
						 let fullname = currUser.username + '#'+ currUser.discriminator
						 if(fullname === userToSearch) return user;
						}); 
				}
				else{
					userCollection = await guild.members.fetch({query: userToSearch, limit: 1});
					if(userCollection != null)
						userObj = userCollection.first();
				}
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
			channelOrigin.send(`User ${userObj} has been found!`);
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