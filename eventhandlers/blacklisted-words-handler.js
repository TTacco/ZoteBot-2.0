var { blacklistedWords } = require('../utils/blacklistedwords.js');
const Discord = require('discord.js');
const { client } = require('../index.js');
const { sleep } = require('../utils/helper-functions.js');
const { blackListHandlerSettings : cfg } = require('../config.json');

if(cfg.enabled){
    client.on('message', message => {  

        if (message.author.bot) return;
    
        let messageWithWhiteSpace = " " + message.toString().toLowerCase() + " ";
        let caughtBadWords = blacklistedWords.filter(badWord => { return messageWithWhiteSpace.includes(" "+badWord+" ") });
    
        if(caughtBadWords.length > 0){
            let channelToNotify = client.channels.cache.get(cfg.channelToNotifyID);
    
            message.author.send(`Auto-deleted your message because it contains the blacklisted word: ${caughtBadWords[0]}`).catch(error => {
                channelToNotify.send(`Unable to send ${message.author.username}#${message.author.discriminator} a DM`);
            }); 
     
            let badWordEmbed = new Discord.MessageEmbed();
            badWordEmbed.setAuthor(`USER: ${message.author.username}#${message.author.discriminator}`);
            badWordEmbed.setThumbnail(message.author.avatarURL());
            badWordEmbed.setTitle(`Auto-deleted blacklisted word: "${caughtBadWords[0]}"`);
            badWordEmbed.setDescription(`User said: "${message}"`);
            badWordEmbed.setColor('#FF4444');
            badWordEmbed.setTimestamp();
            badWordEmbed.setFooter(`User ID: ${message.author.id}`);
            channelToNotify.send(badWordEmbed);
            
            //Closure function to track user bad word violations in a given time period
            function autoMuteAccumulator(){
                let violations = 0;   
                return async function (){
                    violations++;   
                    console.log("Number of violations ", violations)        
                    if(violations >= cfg.maxViolations){
                        const muteCommand = client.commands.get('mute');

                        let proxyMessage = {
                            "author" : {
                                "username" : "ZoteBot",
                                "discriminator" : "6819"
                            },
                            "guild" : message.guild,
                        }
  
                        await muteCommand.execute([message.author.id, "24h", "Auto muted by bot for multiple blacklisted word violations"], proxyMessage);
                        delete client.autoMuteList[message.author.id];  
                    }
    
                    await sleep(cfg.violationCooldownMS);      
                    delete client.autoMuteList[message.author.id];
                }
            } 
    
            //Check of theres already an existing instance of the violation tracker, else increment user violations
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
}
