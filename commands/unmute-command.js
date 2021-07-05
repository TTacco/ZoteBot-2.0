const Discord = require('discord.js');
const { getGuildMemberByNameOrID } = require('../utils/helper-functions.js');
const { client } = require('../index.js');
const { mutes } = client;
const { addUserLog, addMuteEnd } = require('../utils/database-query-helper.js');

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
                return "User specified does not exist, make sure it's in the correct format\nNOTE: "
            }
    
            //Get get the mute role 
            var role = message.guild.roles.cache.find(role => role.name === 'Muted');
    
            //Remove the mute from the 
            guildMember.roles.remove(role);
            const guildMemberID = guildMember['user'].id;
            delete mutes[guildMemberID];
    
            return "Successfully unmuted the user!";
        }
        catch(err){
            return "Error occured while attempting to unmute user " + err;
        }
    }
}