client.on('message', message =>{
	if(message.channel.id === '837605332309377056'){
	console.log('Reading');
		if(message.attachments.size === 0 && !message.member.hasPermission('BAN_MEMBERS')){
			message.reply('This channel is strictly for media only');	
			message.author.send('Sorry but ' + message.channel.name + ' is a media only channel');
			message.delete();
		}

		if(message.attachments.size > 0 && message.content && !message.member.hasPermission('BAN_MEMBERS')){
			message.reply('This channel is strictly for media only');	
			message.author.send(`Sorry but "${message.channel.name}" is a media only channel`);
			message.delete();

			var channelDestination = client.channels.cache.get('837505202994282508');
			var warnUserEmbed = new Discord.MessageEmbed();
			warnUserEmbed.setAuthor(`USER: ${message.author.username}`);
			warnUserEmbed.setThumbnail(message.author.avatarURL());
			warnUserEmbed.setTitle(`Attempting to send text in: "${message.channel.name}"`);
			warnUserEmbed.setDescription(`User said: "${message}"`);
			warnUserEmbed.setFooter(`User ID: "${message.author.id}"`);
			warnUserEmbed.setColor('#FF4444');
			channelDestination.send(warnUserEmbed);
		}
	}
});

