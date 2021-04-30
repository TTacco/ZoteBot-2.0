client.on('message', message =>{
	if(message.channel.id === '837605332309377056'){
	console.log('Reading');
		if(message.attachments.size === 0 && !message.member.hasPermission('KICK_MEMBERS')){
		message.reply('You little shit');	
		message.author.send('I will literally kill you');
		message.delete();
		}
	}
});



