module.exports = {
    //Finds the user via ID or via name tag and returns the user class
    async getUser(client, userIDorNameTag){
        //Check if the arguement is the 18 character long discord ID, if it doesnt then its probably a name tag
		if(/\b([0-9]{18})\b/.test(userIDorNameTag)){
			let cleanedID = userIDorNameTag.replace(/[<>!@]/g, ''); 
			user = client.users.cache.get(cleanedID);
		}
		else{
			user = client.users.cache.find(u => u.tag === userIDorNameTag);
		}

		if(user == null) {
			try{
				channel.send("User not found \n Please use the format of 'USER#0000' or make sure the ID set correctly")
			}
			catch(error){
				console.log('Unable to send message to the channel');
			}
			return null;
		};

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