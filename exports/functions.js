const { Interaction } = require('discord.js');
const fs = require('fs');
module.exports = {
	async verify(msg, arg) {
		if (msg instanceof Interaction) {
			await msg.editReply(arg);
		}
		else {
			await msg.edit(arg);
		}
	},
	setfiles(folder, collection) {
		const files = fs.readdirSync(`./${folder}`).filter(file => file.endsWith('.js'));
		for (const file of files) {
			const command = require(`../${folder}/${file}`);
			collection.set(command.data.name, command);
		}
	},
};