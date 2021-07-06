const Discord = require('discord.js');
const { executeQuery } = require('../utils/database-query-helper.js');
const { getGuildMemberByNameOrID, getUserByID } = require('../utils/helper-functions.js');

module.exports = {
    name: 'editlog',
    aliases: ['edit','el'],
    description: 'Changes the log of a specified user and their log id',
    usage: '-logid -newlogreason',
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