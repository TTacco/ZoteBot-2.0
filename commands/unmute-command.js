const Discord = require('discord.js');
const { getTimeFormatMultiplier, getGuildMemberByNameOrID, sleep} = require('../resources/helper-functions.js');
const { client } = require('../index.js');
const { mutes } = client;
const { addUserLog, addMuteEnd } = require('../resources/database-query-helper.js');

module.exports = {
    name: 'unmute',
    aliases: ['un'],
	description: 'Unmutes a user',
    usage: '-user',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {

        try {
            let userToUnmute = args.shift();
            let guildMember = await getGuildMemberByNameOrID(userToUnmute, message.guild);
            if (!guildMember) {
                message.reply("User specified does not exist, make sure it's in the correct format\nNOTE: ");
                return;
            }
    
            //Get get the mute role 
            var role = message.guild.roles.cache.find(role => role.name === 'Muted');
    
            //Remove the mute from the 
            guildMember.roles.remove(role);
            const guildMemberID = guildMember['user'].id;
            delete mutes[guildMemberID];
    
            message.reply("Successfully unmuted the user!");
        }
        catch(err){
            message.reply("Error occured while attempting to unmute user");
            console.error(err);
        }
    }
}