const { client } = require('../index.js');
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['showcommands', 'commands', 'command', 'c'],
    description: 'Shows all the available bot commands',
    usage: '<COMMAND NAME|ALIAS>',
    example: 'help you just used it dumbass lmao',
    args: false,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        let botCommands = [...client.commands];
        
        let commandList = [];
        botCommands.forEach(element => {
            let el = element[1];
            commandList.push(
            `==${el['name'].toUpperCase()}\n` +
            `-DESCRIPTION: ${el['description']}\n` +
            `-ALIASES: [${el['aliases']}]\n` +
            `-USAGE: ${el['usage']}\n`+
            `-EXAMPLE: ${prefix}${el['example']}`
            ); 
        });

        return "```[COMMANDS]\n"+ commandList.join("\n\n") +"```";
    }
}