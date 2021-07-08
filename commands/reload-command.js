const fs = require('fs');

module.exports = {
	name: 'reload',
	aliases: ['r'],
	description: 'Reloads a command, intended for developer use only',
	usage: '<COMMAND NAME|ALIAS> <COMMAND NAME|ALIAS>',
	example: 'reload mute',
	args: true,
    execute(args, message) {
		const commandName = args[0].toLowerCase();
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return `There is no command with name or alias \`${commandName}\`, ${message.author}!`;
		}

   	 	delete require.cache[require.resolve(`./${command.name}-command.js`)];

    	try {
	 	    const newCommand = require(`./${command.name}-command.js`);
		    message.client.commands.set(newCommand.name, newCommand);
		    return `Command \`${newCommand.name}\` was reloaded!`;
		}
		catch (error) {
		    console.error(error);
		    return `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``;
    	}
	},
};
