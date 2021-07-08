const Discord = require('discord.js');
const {getGuildMemberByNameOrID, getUserByID} = require('../utils/helper-functions.js');

//handles the banning of a user
module.exports = {
	name: 'clear',
	aliases: ['massdelete','bulkdelete','deletemessages'],
	description: 'Deletes a specified amount of message in the parameter',
    usage: '<COMMAND NAME|ALIAS> <AMOUNT>',
	example: "clear 40",
    args: true,
    guildOnly: true,
    cooldown: 3,
	async execute(args, message) {

        amount = parseInt(args.shift(), 10);

        if(!amount){
            return "Unable to bulk delete messages, parameter is not an integer";
        }
        else if(amount <= 0){
            return "Unable to bulk delete messages that are less than 0";
        }

        message.channel.bulkDelete(amount+1);
	},
};