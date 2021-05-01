var { blacklistedWords } = require('../resources/blacklistedwords.js');
const Discord = require('discord.js');
const { client } = require('../index.js');

//Slur  detection
client.on('message', message => {  

    if (message.author.bot) return;

    let messageWithWhiteSpace = " " + message.toString().toLowerCase() + " ";
    let caughtBadWords = blacklistedWords.filter(badWord => { return messageWithWhiteSpace.includes(" "+badWord+" ") });

    if(caughtBadWords.length > 0){
        //Make this modular later, allowing us to specify which channel id it should send it to;
        let channelDestination = client.channels.cache.get('837596563823132732');

        message.author.send(`Auto-deleted your message because it contains the blacklisted word: ${caughtBadWords[0]}`).catch(error => {
            channelDestination.send(`Something went wrong while I tried to send ${message.author.username}#${message.author.discriminator} a DM`);
        }); 
 
        let warnUserEmbed = new Discord.MessageEmbed();
        warnUserEmbed.setAuthor(`USER: ${message.author.username}#${message.author.discriminator}`);
        warnUserEmbed.setThumbnail(message.author.avatarURL());
        warnUserEmbed.setTitle(`Auto-deleted blacklisted word: "${caughtBadWords[0]}"`);
        warnUserEmbed.setDescription(`User said: "${message}"`);
        warnUserEmbed.setColor('#FF4444');
        warnUserEmbed.setTimestamp();
        warnUserEmbed.setFooter(`User ID: ${message.author.id}`);
        channelDestination.send(warnUserEmbed);
        
        message.delete();
    }
});


