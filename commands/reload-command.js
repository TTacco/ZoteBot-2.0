const fs = require('fs');

module.exports = {
	name: 'reload',
	aliases: ['r'],
	description: 'Reloads a command [intended for devs, please do not use this]',
	args: true,
    execute(args, message) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
		}

   	 	delete require.cache[require.resolve(`./${command.name}-command.js`)];

    	try {
	 	    const newCommand = require(`./${command.name}-command.js`);
		    message.client.commands.set(newCommand.name, newCommand);
		    message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		}
		catch (error) {
		    console.error(error);
		    message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
    	}
	},
};
