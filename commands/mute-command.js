const Discord = require('discord.js');
const { getTimeFormatMultiplier, getGuildMemberByNameOrID, sleep} = require('../resources/helper-functions.js');
const { client } = require('../index.js');
const { mutes } = client;
const { addUserLog, addMuteEnd } = require('../resources/database-query-helper.js');

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


        //Get the mute role and the bot role, and checks if the bot has a higher role position to allow muting
        var role = message.guild.roles.cache.find(role => role.name === 'Muted');
        var botRole = message.guild.roles.cache.find(role => role.name === "ZoteBot");
        if(guildMember.roles.highest.position > botRole.position){
            message.reply("Unable to mute the user due to them having a higher role position");
            return;
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
            console.log(error);
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

        /*Uses the GuildMember id as the key with the mute function as the value
        if the mute duration is not greater than 0, do not remove the role, as the assumption is that the user did not specify
        a mute duration, thus permanently muting the user unless removed.
        */
        if(muteDurationMS){
            mutes[guildMemberID] = removeMute();
        }
        //Assume the rest of the arguements is the reason for the mute
        muteReason = (args.length)? args.join(' ') : 'No reason specified';


        try {
            let muteEmbed = new Discord.MessageEmbed();

            muteEmbed.setTitle('M.O.H. Citation - Protocol Violated');
            muteEmbed.setThumbnail(user.avatarURL());
            muteEmbed.addFields(
                { name: 'USER:', value: `${user.username+'#'+user.discriminator}`, inline: true },
                { name: 'ID:', value: user.id, inline: true },
                { name: 'PENALTY', value: 'Mute', inline: true },
                { name: 'REASON', value: `DURATION [${(muteDurationMS)? muteDurationFormat : 'Indefinite'}] - ${muteReason}` },
                { name: 'ISSUED BY:', value: `${message.author.username+'#'+message.author.discriminator}`},
            );
            muteEmbed.setColor('#ff8103');			
            muteEmbed.setTimestamp();

            //await guildMember.send(`You have been muted in **${message.guild.name}** \nReason: ${muteReason}`);
            message.channel.send(muteEmbed);
        } catch (error) {
            return message.reply(`Failed to send embeded: ${guildMember.name}\nError: ${error}`, message.channel);
        }
  
        let logInfo = {
            log_type: "MUTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: muteReason,
            log_moderator: message.author.username+'#'+message.author.discriminator,
            log_user_id: guildMemberID, 
        };
    
        await addUserLog(logInfo);

        //dont update the mute end if the mute is indefinite
        if(muteDurationMS)
            await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);      
    },

    async autoMute(userId, guild){
        //Get the GuildMember object of a specified ID
        const muteDurationMS = 10;//8.64e+7;
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
        mutes[guildMemberID] = removeMute(guildMemberID, muteDurationMS);

        //Send message to user
        try{
            await guildMember.send(`You have been muted in **${guild.name}** \nReason: multiple bad word violations`);
        }
        catch(err){
            console.log(err);
        }

        try {
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

            //await guildMember.send(`You have been muted in **${message.guild.name}** \nReason: ${muteReason}`);
            client.channels.cache.get('837596563823132732').send(muteEmbed);
        } catch (err) {
            console.log(err);
        }

        //Add log and mute end to database
        let logInfo = {
            log_type: "MUTE",
            log_username: (user.username+'#'+user.discriminator),
            log_reason: '`DURATION [24h]- Automod bad word violation exceeded`',
            log_moderator: 'ZoteBot',
            log_user_id: guildMemberID, 
        };
        await addUserLog(logInfo);
        await addMuteEnd((Date.now() + muteDurationMS), guildMemberID);  
    }
}