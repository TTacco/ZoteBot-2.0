var { blacklistedWords } = require('../resources/blacklistedwords.js');
const { sleep } = require('../resources/helper-functions.js');
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
            channelDestination.send(`Unable to send ${message.author.username}#${message.author.discriminator} a DM`);
        }); 
 
        let badWordEmbed = new Discord.MessageEmbed();
        badWordEmbed.setAuthor(`USER: ${message.author.username}#${message.author.discriminator}`);
        badWordEmbed.setThumbnail(message.author.avatarURL());
        badWordEmbed.setTitle(`Auto-deleted blacklisted word: "${caughtBadWords[0]}"`);
        badWordEmbed.setDescription(`User said: "${message}"`);
        badWordEmbed.setColor('#FF4444');
        badWordEmbed.setTimestamp();
        badWordEmbed.setFooter(`User ID: ${message.author.id}`);
        channelDestination.send(badWordEmbed);
        
        
        function autoMuteAccumulator(){
            let violations = 0;   
            return async function (){
                violations++;   
                console.log("Number of violations ", violations)        
                if(violations > 2){
                    const muteCommand = client.commands.get('mute');
                    muteCommand.autoMute(message.author.id, message.guild);
                    delete client.autoMuteList[message.author.id];
                }

                await sleep(10000);      
                delete client.autoMuteList[message.author.id];
            }
        } 

        let autoMuteInstance = client.autoMuteList[message.author.id];
        if(!autoMuteInstance){
            client.autoMuteList[message.author.id] = autoMuteAccumulator();
            client.autoMuteList[message.author.id]();
        }
        else{
            autoMuteInstance();
        }
        

        message.delete();
    }
});


