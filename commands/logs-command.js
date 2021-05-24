const Discord = require('discord.js');
const { retrieveUserLogs } = require('../resources/databaseQueryHelper.js');
const { getGuildMemberByNameOrID, getUserByID } = require('../resources/helperFunctions.js');

module.exports = {
    name: 'logs',
    aliases: ['l', 'log'],
    description: 'Shows the logs of a specified user user',
    usage: '-userid',
    args: true,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {

        let user = await getGuildMemberByNameOrID(args[0], message.guild)['user'] || await getUserByID(args[0]);
        if (!user) {
            message.reply("User specified does not exist, make sure it's in the correct format");
            return;
        }

        //Create the log display message
        //let userLogs = retrieveUserLogs(user.id);
        let userLogs = await retrieveUserLogs(user.id);
        let logDisplayMessage = await message.channel.send('Fetching userlogs...');

        try {
            //await logDisplayMessage.react('⬅️');
            //await logDisplayMessage.react('➡️');
       


        } catch (error) {       
            console.error('One of the emojis failed to react:', error);
        }

        logDisplayMessage.react('⬅️').then(() => logDisplayMessage.react('➡️')).catch(error => console.error('One of the emojis failed to react:', error));

        //Making a closure so that it has its own local scope 'object'
        const onMessageReact = function (uL, lDM) {
            let lowerBound = 0;
            let userLogs_local = uL;
            let logDisplayMessage_local = lDM
            let initLogsToDisplay = userLogs_local.slice(lowerBound, lowerBound + 5);

            try {
                logDisplayMessage_local.edit(createLogEmbed(initLogsToDisplay));
            }
            catch (err) {
                console.error("Unable to create log embedding ", err);
                return;
            }


            return async (reaction, user) => {
                if (!['⬅️', '➡️'].includes(reaction.emoji.name) || user.bot) return false;

                let prevLowerBound = lowerBound;
                lowerBound += ('➡️' === reaction.emoji.name) ? 5 : -5;
                //Ensures the value never goes negative or it is in divisible increments of 5
                lowerBound = (lowerBound > userLogs_local.length) ? prevLowerBound : Math.max(0, lowerBound);
                if (prevLowerBound === lowerBound) return;

                let logSnippet = userLogs_local.slice(lowerBound, (lowerBound + 5));
                logDisplayMessage_local.edit(createLogEmbed(logSnippet));

            }

            function createLogEmbed(logsToDisplay) {
                let logEmbed = new Discord.MessageEmbed();
                logEmbed.setTitle(`M.O.H. TRANSCRIPT OF RECORDS`);
                logEmbed.setDescription(`Transcript For User: ${user.username + '#' + user.discriminator}`);
                logEmbed.setColor(`#963499`);

                for (i = 0; i < logsToDisplay.length; i++) {
                    let row = logsToDisplay[i];

                    logEmbed.addField('[LOG#]', `${row.log_id}`, true);
                    logEmbed.addField('[TYPE]', `${row.log_type}`, true);

                    //console.log(new Date(row.log_date).toISOString);
                    let date = new Date(row.log_date);
                    let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    let details =
                        `- **User**:\ ${row.log_username}\n`
                        + `- **Reason**:\ "${row.log_reason}"\n`
                        + `- **Date**:\ ${dateString}\n\n`;
                    if (i !== (logsToDisplay.length - 1)) details += `-`.repeat(55);

                    logEmbed.addField('[DETAILS]', details);
                }

                return logEmbed;
            }
        }

        try {
            let receivedReactions = await logDisplayMessage.awaitReactions(onMessageReact(userLogs, logDisplayMessage), { time: 40000, errors: ['time'] });
        }
        catch (err) {
            console.log("Done collecting emotes");
        };

    }
}