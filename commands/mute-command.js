const Discord = require('discord.js');
const { getTimeFormatMultiplier, getGuildMemberByNameOrID, getUserByID, sleep} = require('../utils/helper-functions.js');
const { addUserLog, addMuteEnd } = require('../utils/database-query-helper.js');
const { client  } = require('../index.js');
const { mutes } = client;
const { config } = require('../config.json');

module.exports = {
    name: 'mute',
    aliases: ['m'],
	description: 'Mutes a user for a given duration and reason ',
    usage: '<COMMAND NAME|ALIAS> <DURATION ([dhms]|days?|hours?|minutes?|seconds?)> <REASON>',
    example: 'm User#1234 24h example reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {   

        const guild = message.guild;
        const author = message.author;

        let targetUser = args.shift();
        let muteReason = '';
        let muteDurationMS = 0; 
        let executionResults = [];

        //Expect 1st arguement to be the user ID
        //If the GuildMember does not exist, return. (The getGuildMember function will throw the error message for us)
        let guildMember = await getGuildMemberByNameOrID(targetUser, guild) || await getUserByID(targetUser);
        if (!guildMember) {
            return "User specified does not exist, make sure it's in the correct format";
        }
        let user = guildMember['user'];

        //Get the mute role and the bot role, and checks if the bot has a higher role position to allow muting
        var role = guild.roles.cache.find(role => role.name === 'Muted');
        var botRole = guild.roles.cache.find(role => role.name === "ZoteBot");
        if(guildMember.roles.highest.position > botRole.position){
            return `Unable to mute ${user.username}#${user.discriminator} due to them having a higher role position`;
        }

        /*
            Expect the next arguement to be the muteDurationFormat, which to contain the time and format ie ('24h', '3days' etc), 
            use regex to check if the value is valid, getTimeFormatMultiplier will accept the arguement and attempt to parse it
            into miliseconds. If there is no valid format given, assume none was given and the user is to be muted indefinitely instead.
        */
        let muteDurationFormat = args[0];
        try{ 
            const rgx = new RegExp( '^[0-9]+', 'g' );
            rgx.test(muteDurationFormat)
            //Split the time (ie 24, 3) and the format (h, d) into seperate elements in an array
            let [mDurationArg, mFormatArg]= [muteDurationFormat.slice(0, rgx.lastIndex), muteDurationFormat.slice(rgx.lastIndex, muteDurationFormat.length)];
    
            let duration = parseInt(mDurationArg);
            let format = mFormatArg.toLowerCase();      
            muteDurationMS = (getTimeFormatMultiplier(format) || 0) * duration;
            if(muteDurationMS){
                //gets rid of the current arg which contains the mute duration  
                args.shift();     
            }           
        }catch(error){
            //Format is incorrect, mute is to be indefenite
            muteDurationMS = 0;
        }

        //Add the mute role to the GuildMember, then add an async function to remove said mute after a certain period of time
        guildMember.roles.add(role);
        const guildMemberID = guildMember['user'].id;

        /*Uses the GuildMember/User's id as the key with the mute async function as the value
        if the mute duration is not greater than 0, do not remove the role, as the assumption is that the user did not specify
        a mute duration, thus permanently muting the user unless removed.
        */
        async function removeMute(gm) {
            //Removes the mute from the global mute variable after a certain period of time
            await sleep(muteDurationMS);
            gm.roles.remove(role);
            delete mutes[guildMemberID]; 
        };
        if(muteDurationMS){
            mutes[guildMemberID] = removeMute(guildMember);
        }
        
        //Assume the rest of the arguements is the reason for the mute, so we join them all together
        muteReason = (args.length)? args.join(' ') : 'No reason specified'; 

        //Add logs to the database
        let logInfo = {
            log_type: "MUTE",
            log_username: (`${user.username}#${user.discriminator}`),
            log_reason: muteReason,
            log_moderator: (`${author.username}#${author.discriminator}`),
            log_user_id: guildMemberID, 
        };
        await addUserLog(logInfo);
        //Only update the [mute end] column in the database if the mute is finite
        if(muteDurationMS){
            await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);      
        }        

        try {   
            let muteDMEmbed = new Discord.MessageEmbed();
            muteDMEmbed.setTitle(`You have been muted in **${guild.name}**`);
            muteDMEmbed.setDescription(`DURATION [${(muteDurationMS)? muteDurationFormat : 'Indefinite'}] Reason: ${muteReason}`);
            muteDMEmbed.setColor('#cf3823');

            await guildMember.send(muteDMEmbed);
        }
        catch (error){
            executionResults.push(`Failed to send mute warning to ${user.username}#${user.discriminator}, recipient has most likely disabled DMs/blocked the bot.`);
        }

        //Create the embed
        let muteEmbed = new Discord.MessageEmbed();
        muteEmbed.setTitle('K.O.H. Proclamation of Censor');
        muteEmbed.setThumbnail(user.avatarURL());
        muteEmbed.addFields(
            { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
            { name: 'ID:', value: user.id, inline: true },
            { name: 'PENALTY', value: 'Mute', inline: true },
            { name: 'REASON', value: `DURATION [${(muteDurationMS)? muteDurationFormat : 'Indefinite'}] - ${muteReason}` },
            { name: 'ISSUED BY:', value: `${logInfo.log_moderator}`},
        );
        muteEmbed.setColor('#cf3823');			
        muteEmbed.setTimestamp();      
        executionResults.push(muteEmbed);

        return executionResults;
    }
}