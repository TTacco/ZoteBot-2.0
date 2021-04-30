var { botTokenID } = require('./modules/token.js');
var { blacklistedWords } = require('./modules/blacklistmodule.js');

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('ZOTEBOT STATUS: ENABLED');
});

client.login(botTokenID);

client.on('message', message => {  
	if (message.content === '!awaken') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Ensuring the destruction of shitposters.');
    }
 
    
    var match = blacklistedWords.exec(message.content);
    console.log("match is ", match);
    if(match != null){
        //message.author.send('You have said a slur you curr!');
        message.delete();

        client.channels.cache.get('837505202994282508').send(`This dipshit just said **${match[0]}**, User: ${message.author.username} `);
    }
});

