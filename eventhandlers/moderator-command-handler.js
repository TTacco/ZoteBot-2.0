const Discord = require('discord.js');
const { client } = require('../index.js');
const { banUser } = require('../commands/ban-command.js');

const allowedRoles = ['admins', 'moderators']

client.on('message', message => {  

    //convert this into a configurable prefix later
    if (message.author.bot || !message.content.startsWith("!")) return;

    if(!message.member.roles.cache.some(role => {
        return ( role.name.toLowerCase() === 'admin' ||
        role.name.toLowerCase() === 'moderators')
    })) {
        return;
    }  

    let arguments = message.content.substr(1, message.content.length).trim().split(" ");
    let command = arguments.shift().toLowerCase(); 
    
    switch(command){
        case 'warn':

            break;
        case 'mute': 

            break;
        case 'ban':
        case 'fox2':
            banUser(client, arguments, [message.channel, message.guild]);
            break;
        default:
            message.channel.send(`Unable to recognize the command: "${command}"`);
            break;
    }
});


