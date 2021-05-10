const Discord = require('discord.js');
const { getUserObjectByNameOrID, sendMessageToChannel } = require('../resources/utils');
const { aliases } = require('../resources/timemultiplier');

module.exports = {
    name: 'mute',
    aliases: ['m'],
	description: 'Mutes a user',
    usage: '-user -duration([dhms]|days?|hours?|minutes?|seconds?)>-reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        
        let userToMute = args.shift();
        let muteReason = '';

        let user = await getUserObjectByNameOrID(message.client, userToMute, message.guild, message.channel);
        if (!user) {
            return;
        }

        console.log(aliases);

        return;

        //Mute duration and time format
        const rgx = new RegExp( '^[0-9]+', 'g' );
        rgx.test(args[0]);
        let [mDurationArg, mFormatArg]= [args[0].slice(0, rgx.lastIndex), args[0].slice(rgx.lastIndex, args[0].length)];

        try{
            if(mDurationArg){
                let muteDurMillisec = 0; //mute duration in milliseconds
                let duration = parseInt(mDurationArg);
                let format = mFormatArg.toLowerCase();
                if(['days','day','d'].includes(format)){
                    muteDurMillisec = duration * timeMultipliers['getDayMultiplier']();
                }
                else if(['hours','hour','h'].includes(format)){
                    muteDurMillisec = duration * timeMultipliers['getHourMult']();
                }
                else if(['minutes','minute','m'].includes(format)){
                    muteDurMillisec = duration * timeMultipliers['getMinuteMultiplier']();
                }
                else if(['seconds','second','s'].includes(format)){
                    muteDurMillisec = duration * timeMultipliers['getSecondMultiplier']();
                }
                else{
                    await message.channel.send('Time format cannot be understood, please use the correct notation')
                    return;
                }
                
                
                args.shift(); //gets rid of the current arg which contains the mute duration             
            }
        }catch(error){
            console.log(error);
        }

        muteReason = (args.length)? 'No reason specified': args.join(' ');

        return; 
        //Assume the rest of the arguements is the reason
        try {
            let warnEmbed = new Discord.MessageEmbed();
            warnEmbed.setAuthor(`${user.username}#${user.discriminator}`);
            warnEmbed.setThumbnail(user.avatarURL());
            warnEmbed.setTitle(`M.O.H. Citation - [WARNED]`);
            warnEmbed.setDescription('**Reason:** ' + muteReason);
            warnEmbed.setColor('#e3c022');
            warnEmbed.setFooter(`USER ID: ${user.id}`);
            warnEmbed.setTimestamp();

            await user.send(`You have warned been from **${message.guild.name}** \nReason: ${muteReason}`);
            message.channel.send(warnEmbed);
        } catch (error) {
            return sendMessageToChannel(`Failed to warn: ${user.name}\nError: ${error}`, message.channel);
        }

    }
}