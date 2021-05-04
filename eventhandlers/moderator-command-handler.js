const Discord = require('discord.js');
const { client } = require('../index.js');
const { banUser, massBan, unBanUser } = require('../commands/ban-command.js');

const allowedRoles = ['admin', 'moderators'];

client.on('message', message => {  

    //convert this into a configurable prefix later
    if (message.author.bot || !message.content.startsWith("!")) return;


    if(!message.member.roles.cache.some(role => { 
      return allowedRoles.includes(role.name.toLocaleLowerCase());
    })){
        message.channel.send(`No permissions to use this role`);
        return;
    } 

    let arguments = message.content.substr(1, message.content.length).trim().split(/\s+/);
    let command = arguments.shift().toLowerCase(); 


    switch(command){
        case 'warn':

            break;
        case 'mute': 

            break;
        case 'ban':
        case 'fox2':
        case 'foxtwo':
            banUser(client, arguments, [message.channel, message.guild, message.author]);
            break;
        case 'massban':
            massBan(client, arguments, message);
            break;
        case 'unban':
            unBanUser(client, arguments, [message.channel, message.guild]);
            break;
        default:
            message.channel.send(`Unrecognized command: "${command}"`);
            break;
    }
});


