const Discord = require('discord.js');
const { client } = require('../index.js');
const { prefix } = require('../config.json');
const { cooldowns } = client;


const allowedRoles = ['admin', 'moderators'];

client.on('message', message => {  

    //convert this into a configurable prefix later
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    if(!message.member.roles.cache.some(role => { 
      return allowedRoles.includes(role.name.toLocaleLowerCase());
    })){
        message.channel.send(`No permissions to use this role`);
        return;
    } 

    let args = message.content.substr(1, message.content.length).trim().split(/\s+/);
    let commandName = args.shift().toLowerCase(); 
    
    const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //Check if the command exists
    if (!command){
        return;
    } 


    //Check whether the command isn't allowed to be called in DM
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('This command cannot be executed in a DM');
    }
    
    //Check if the command requires arguements
    if (command.args && !args.length) {
        let reply = `No valid arguements provided, ${message.author}!`;

        if (command.usage) {
            reply += `\nPlease format it as: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

        
    //Cooldown timer
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;   
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    

    //Attempt to execute the command
    try {
		command.execute(args, message);
	} catch (error) {
		console.error(error);
		message.reply('Error occured on command execution.');
	}

});


