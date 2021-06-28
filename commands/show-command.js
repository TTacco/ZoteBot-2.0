const { client } = require('../index.js');

module.exports = {
    name: 'show',
    aliases: ['showcommands', 'commands', 'command', 'c'],
    description: 'Shows all the available bot commands',
    usage: '-prefix',
    args: false,
    guildOnly: true,
    cooldown: 3,
    async execute(args, message) {
        let botCommands = [...client.commands];
        
        console.log("you have tied for the lead");

        let commandList = [];
        botCommands.forEach(element => {
            commandList.push(`${element[1]['name']} - ${element[1]['description']}`);
        });

        message.channel.send("```**COMMANDS**\n"+ commandList.join("\n") +"```");
    }
}