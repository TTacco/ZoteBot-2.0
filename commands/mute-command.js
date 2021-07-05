const Discord = require('discord.js');
const { getTimeFormatMultiplier, getGuildMemberByNameOrID, getUserByID, sleep} = require('../utils/helper-functions.js');
const { client } = require('../index.js');
const { mutes } = client;
const { addUserLog, addMuteEnd } = require('../utils/database-query-helper.js');
const { config } = require('../config.json');

module.exports = {
    name: 'mute',
    aliases: ['m'],
	description: 'Mutes a user',
    usage: '-user -duration([dhms]|days?|hours?|minutes?|seconds?)>-reason',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {   
        const guild = message.guild;
        const author = message.author;

        let userToMute = args.shift();
        let muteReason = '';
        let muteDurationMS = 0; 
        let executionResults = [];

        //If the GuildMember does not exist, return. (The getGuildMember function will throw the error message for us)
        let guildMember = await getGuildMemberByNameOrID(userToMute, guild) || await getUserByID(userToMute);
        if (!guildMember) {

            return ["User specified does not exist, make sure it's in the correct format"];
        }
        let user = guildMember['user'];

        //Get the mute role and the bot role, and checks if the bot has a higher role position to allow muting
        var role = guild.roles.cache.find(role => role.name === 'Muted');
        var botRole = guild.roles.cache.find(role => role.name === "ZoteBot");
        if(guildMember.roles.highest.position > botRole.position){
            return ["Unable to mute the user due to them having a higher role position"];
        }

        //expect muteDurationFormat to contain the time and format ie ('24h', '3d' etc), 
        //getTimeFormatMultiplier uses regex to check if the value is valid, otherwise null
        let muteDurationFormat = args[0];
        try{ 
            const rgx = new RegExp( '^[0-9]+', 'g' );
            rgx.test(muteDurationFormat)
            //split the time (ie 24, 3) to the format (h, d)
            let [mDurationArg, mFormatArg]= [muteDurationFormat.slice(0, rgx.lastIndex), muteDurationFormat.slice(rgx.lastIndex, muteDurationFormat.length)];
    
            let duration = parseInt(mDurationArg);
            let format = mFormatArg.toLowerCase();      
            muteDurationMS = (getTimeFormatMultiplier(format) || 0) * duration;
            if(muteDurationMS){
                args.shift(); //gets rid of the current arg which contains the mute duration     
            }           
        }catch(error){
            muteDurationMS = 0;
        }

        //Add the mute role to the GuildMember, then add an async function to remove said mute after a certain period of time
        guildMember.roles.add(role);
        const guildMemberID = guildMember['user'].id;
        async function removeMute(gm) {
            await sleep(muteDurationMS);
            gm.roles.remove(role);
            delete mutes[guildMemberID]; //removes the mute from the global mute var
        };

        /*Uses the GuildMember id as the key with the mute function as the value
        if the mute duration is not greater than 0, do not remove the role, as the assumption is that the user did not specify
        a mute duration, thus permanently muting the user unless removed.
        */
        if(muteDurationMS){
            mutes[guildMemberID] = removeMute(guildMember);
        }
        
        //Assume the rest of the arguements is the reason for the mute
        muteReason = (args.length)? args.join(' ') : 'No reason specified'; 
        let moderatorName = author.username || "ZoteBot" `${author.username || "ZoteBot"}#${author.discriminator || 6819}`;
        let logInfo = {
            log_type: "MUTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: muteReason,
            log_moderator: (moderatorName),
            log_user_id: guildMemberID, 
        };

                //Add logs to the database
        await addUserLog(logInfo);
        //dont update the mute end column in the databse if the mute is indefinite
        if(muteDurationMS){
            await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);      
        }        
        
        //Add logs to the database
        await addUserLog(logInfo);

        //dont update the mute end column in the databse if the mute is indefinite
        if(muteDurationMS){
            await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);      
        }
    
        let muteEmbed = new Discord.MessageEmbed();

        try {   
            await guildMember.send(`You have been muted in **${guild.name}** \nReason: ${muteReason}`);
        }
        catch (error){
            executionResults.push(`Failed to send mute warning to ${guildMember.name}, recipient has most likely disabled DMs/blocked the bot.`);
        }

        muteEmbed.setTitle('M.O.H. Citation - Protocol Violated');
        muteEmbed.setThumbnail(user.avatarURL());
        muteEmbed.addFields(
            { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
            { name: 'ID:', value: user.id, inline: true },
            { name: 'PENALTY', value: 'Mute', inline: true },
            { name: 'REASON', value: `DURATION [${(muteDurationMS)? muteDurationFormat : 'Indefinite'}] - ${muteReason}` },
            { name: 'ISSUED BY:', value: `${logInfo.log_moderator}`},
        );
        muteEmbed.setColor('#ff8103');			
        muteEmbed.setTimestamp();      
        executionResults.push(muteEmbed);

        return executionResults;
    },

    async autoMute(userId, guild){
        //Get the GuildMember object of a specified ID
        let guildMember = await getGuildMemberByNameOrID(userId, guild);
        if (!guildMember) {
            console.error("Encountered a problem with automuting a user", err);
            return;
        }

        //Give the role and the auto remove duration
        var role = guild.roles.cache.find(role => role.name === 'Muted');
        guildMember.roles.add(role);
        const user = guildMember['user'];
        const guildMemberID = user.id;
        async function removeMute(id, duration) {
            try{
                await sleep(duration * 1000);
                guildMember.roles.remove(role);
                delete mutes[id]; //removes the mute from the global mute var
            }
            catch(err){
                console.log(err);
            }
        };
        mutes[guildMemberID] = removeMute(guildMemberID, config.violationMuteDurationMS);

        //Add log and mute end to database
        let logInfo = {
            log_type: "MUTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: '`DURATION [24h]- Automod bad word violation exceeded`',
            log_moderator: 'ZoteBot',
            log_user_id: guildMemberID, 
        };

        //Database handler
        await addUserLog(logInfo);
        await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);  

        let muteEmbed = new Discord.MessageEmbed();
        muteEmbed.setTitle('M.O.H. Citation - Protocol Violated');
        muteEmbed.setThumbnail(user.avatarURL());
        muteEmbed.addFields(
            { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
            { name: 'ID:', value: user.id, inline: true },
            { name: 'PENALTY', value: 'Mute', inline: true },
            { name: 'REASON', value: `DURATION [24h]- Automod bad word violation exceeded` },
            { name: 'ISSUED BY:', value: `ZoteBot`},
        );
        muteEmbed.setColor('#ff8103');			
        muteEmbed.setTimestamp();

        client.channels.cache.get('837596563823132732').send(muteEmbed);
        //Send message to user
        try{
            await guildMember.send(`You have been muted in **${guild.name}** \nReason: multiple bad word violations`);
            return muteEmbed;
        }
        catch(err){
            return ["Unable to send DM to user", muteEmbed];
        }


    }
}