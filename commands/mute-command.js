const Discord = require('discord.js');
const { getTimeFormatMultiplier, getGuildMemberByNameOrID, sleep} = require('../resources/helperFunctions');
const { client } = require('../index.js');
const { mutes } = client;
const { addUserLog, addMuteEnd } = require('../resources/databaseQueryHelper.js');

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
        let muteDurationMS = 0; 

        //If the GuildMember does not exist, return. (The getGuildMember function will throw the error message for us)
        let guildMember = await getGuildMemberByNameOrID(userToMute, message.guild);
        if (!guildMember) {
            message.reply("User specified does not exist, make sure it's in the correct format\nNOTE: ");
            return;
        }
        let user = guildMember['user'];

        //Mute duration and time format
        const rgx = new RegExp( '^[0-9]+', 'g' );
        rgx.test(args[0]);
        let [mDurationArg, mFormatArg]= [args[0].slice(0, rgx.lastIndex), args[0].slice(rgx.lastIndex, args[0].length)];

        try{
            if(mDurationArg){
                //mute duration in milliseconds so we can use it for setTimeout()
                let duration = parseInt(mDurationArg);
                let format = mFormatArg.toLowerCase();      
                muteDurationMS = (getTimeFormatMultiplier(format) || 0) * duration;
                if(muteDurationMS){
                    args.shift(); //gets rid of the current arg which contains the mute duration     
                }           
            }
        }catch(error){
            console.log(error);
        }
        muteReason = (args.length)? args.join(' ') : 'No reason specified';

        //Get get the mute role and the bot role, and checks if the bot has a higher role position to allow muting
        var role = message.guild.roles.cache.find(role => role.name === 'Muted');
        var botRole = message.guild.roles.cache.find(role => role.name === "ZoteBot");
        if(guildMember.roles.highest.position > botRole.position){
            message.reply("Unable to mute the user due to them having a higher role position");
            return;
        }

        //Add the mute role to the GuildMember, then add an async function to remove said mute after a certain period of time
        guildMember.roles.add(role);
        const guildMemberID = guildMember['user'].id;
        async function removeMute() {
            try{
                await sleep(muteDurationMS);
                guildMember.roles.remove(role);
                delete mutes[guildMemberID]; //removes the mute from the global mute var
            }
            catch(err){
                console.log(err);
            }
        };

        //Uses the GuildMember id as the key with the mute function as the value
        mutes[guildMemberID] = removeMute();
        //Assume the rest of the arguements is the reason
        try {
            let muteEmbed = new Discord.MessageEmbed();

            muteEmbed.setTitle('M.O.H. Citation - Protocol Violated');
            muteEmbed.setThumbnail(user.avatarURL());
            muteEmbed.addFields(
                { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
                { name: 'ID:', value: user.id, inline: true },
                { name: 'PENALTY', value: 'Mute', inline: true },
                { name: 'REASON', value: muteReason},
                { name: 'ISSUED BY:', value: `${message.author.username+'#'+message.author.discriminator}`},
            );
            muteEmbed.setColor('#ff8103');			
            muteEmbed.setTimestamp();

            //await guildMember.send(`You have been muted in **${message.guild.name}** \nReason: ${muteReason}`);
            message.channel.send(muteEmbed);
        } catch (error) {
            return message.reply(`Failed to mute: ${guildMember.name}\nError: ${error}`, message.channel);
        }

        let logInfo = {
            log_type: "MUTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: muteReason,
            log_moderator: message.author.username+'#'+message.author.discriminator,
            log_user_id: guildMemberID, 
        };
    
        await addUserLog(logInfo);
        await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);      
    }
}