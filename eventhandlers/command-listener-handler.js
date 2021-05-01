const Discord = require('discord.js');
const { client } = require('../index.js');

//Slur  detection
client.on('message', message => {  

    let command = message.toString();
    if (message.author.bot || !command.startsWith("!")) return;

    command = command.substr(1, command.length);
    command = command.toLowerCase();
    command = command.split(" ");
    
    message.channel.send(`Command Executed: ${command[0]}`);

    switch(command[0]){
        case 'warn':
        message.channel.send(`Better stop now ${command[2]}`);
            break;
        case 'mute': 
        message.channel.send(`Shut the fuckup ${command[2]}`);
            break;
        case 'ban':
            message.channel.send(`Someone's gonna die today, and im sure its "${command[1]}"`);
            break;
        default:
            message.channel.send(`Unable to recognize the command: "${command[0]}"`);
            break;
    }
});


