const Discord = require('discord.js');
const { getGuildMemberByNameOrID } = require('../utils/helper-functions.js');
const { client } = require('../index.js');
const { mutes } = client;
const { addUserLog, addMuteEnd } = require('../utils/database-query-helper.js');

module.exports = {
    name: 'unmute',
    aliases: ['um'],
	description: 'Unmutes a user (does not remove their log)',
    usage: '<COMMAND NAME|ALIAS> <USER>',
    example: 'um User#1234',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {

        const guild = message.guild;

        try {
            let targetUser = args.shift();

            let guildMember = await getGuildMemberByNameOrID(targetUser, guild) || await getUserByID(targetUser);
            if (!guildMember) {
                return "User specified does not exist, make sure it's in the correct format\nNOTE: "
            }
    
            //Get get the mute role 
            var role = guild.roles.cache.find(role => role.name === 'Muted');
    
            //Remove the mute from the 
            guildMember.roles.remove(role);
            const guildMemberID = guildMember['user'].id;
            delete mutes[guildMemberID];
    
            return "Successfully unmuted the user!";
        }
        catch(error){
            console.error(error);
            return "Error occured while attempting to unmute user";
        }
    }
}