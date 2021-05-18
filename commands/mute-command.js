const Discord = require('discord.js');
const { getGuildMemberByNameOrID, sleep } = require('../resources/utils');
const { getTimeFormatMultiplier } = require('../resources/timemultiplier');

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
        let durationInMilliseconds = 0; 

        let user = await getGuildMemberByNameOrID(message.client, userToMute, message.guild, message.channel);
        if (!user) {
            return;
        }

        //Mute duration and time format
        const rgx = new RegExp( '^[0-9]+', 'g' );
        rgx.test(args[0]);
        let [mDurationArg, mFormatArg]= [args[0].slice(0, rgx.lastIndex), args[0].slice(rgx.lastIndex, args[0].length)];

        try{
            if(mDurationArg){
                //mute duration in milliseconds so we can use it for setTimeout()
                let duration = parseInt(mDurationArg);
                let format = mFormatArg.toLowerCase();
                
                durationInMilliseconds = (getTimeFormatMultiplier(format) || 0) * duration;

                if(durationInMilliseconds){
                    args.shift(); //gets rid of the current arg which contains the mute duration     
                }           
            }
        }catch(error){
            console.log(error);
        }

        muteReason = (args.length)? args.join(' ') : 'No reason specified';
        console.log(`mute duration in milliseconds ${durationInMilliseconds}`);


        async function muteUser(){
            var role = message.guild.roles.cache.find(role => role.name === "Muted");


            //console.log(message.guild.members.cache);
            //await sleep(10000);
            //user.removeRole(role);
        }
        
        muteUser();

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
            return message.channel.send(`Failed to warn: ${user.name}\nError: ${error}`, message.channel);
        }

    }
}