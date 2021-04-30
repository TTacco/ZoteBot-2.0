client.on('message', message =>{
	if(message.channel.id === '837605332309377056'){
	console.log('Reading');
		if(message.attachments.size === 0 && !message.member.hasPermission('KICK_MEMBERS') || message.attachments.size > 0 && message.content && !message.member.hasPermission('KICK_MEMBERS')){
			message.reply('This channel is strictly for media only');	
			message.author.send('Sorry but ' + message.channel.name + ' is a media only channel');
			message.delete();
		}
	}
});


