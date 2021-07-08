const Discord = require('discord.js');
const { executeQuery } = require('../utils/database-query-helper.js');
const { getGuildMemberByNameOrID, getUserByID } = require('../utils/helper-functions.js');

module.exports = {
    name: 'editlog',
    aliases: ['edit','el'],
    description: 'Edits the log of a specified log in the database',
    usage: '<COMMAND NAME|ALIAS> <LOG ID> <NEW LOG>',
    example: "el 000012 I am editing this user log!" ,
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {

        let logidArg = args.shift();
        let newLog = args.join(' ');

        console.log(`Inputted arguements are: ${logidArg}`);

        let retrieveQuery = `SELECT EXISTS(SELECT * FROM users_log WHERE log_id = ${logidArg} LIMIT 1);`;
        let logExists = await executeQuery(retrieveQuery); 
        if(logExists){
            let updateQuery = `UPDATE users_log SET log_reason = '${newLog}' WHERE log_id=${logidArg}`
            let result = await executeQuery(updateQuery); 

            if(!result){
                return "Failed to execute edit log command, please check the logs.";
            }
        }
        else{
            return `Log #${logidArg} does not exist`;
        }

        return "Successfully executed the query";
    }
}