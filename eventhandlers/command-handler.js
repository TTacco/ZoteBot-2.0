const Discord = require('discord.js');
const { prefix, commandHandlerSetings : cfg } = require('../config.json');
const { client } = require('../index.js');
const { cooldowns } = client;

if(cfg.enabled){
    client.on('message', message => {  

        if (message.author.bot || !message.content.startsWith(prefix)) return;
    
        if(!message.member.roles.cache.some(role => { 
          return cfg.allowedRoleNames.includes(role.name.toLocaleLowerCase());
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
            let results = command.execute(args, message);
            if(!results) return;
            
            //Resolve the promise
            results.then((res) => {
            //Check if the results received is a null
                if(res){
                    if(Array.isArray(results)){
                        results.then((res) => {
                            message.channel.send(...res);
                        });
                    }
                    else{
                        message.channel.send(res);
                    }
                }
            });
        } catch (error) {
            console.error(error);
            message.channel.send('Error occured on command execution.', error);
        }
    
    });
}

