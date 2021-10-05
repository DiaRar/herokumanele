const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const token = process.env.TOKEN;
const client = process.env.CLIENT;
module.exports = {
	async deploy(guildId, command) {
		let commands;
		const rest = new REST({ version: '9' }).setToken(token);
		try {
			commands = await rest.request(Routes.applicationGuildCommands(client, guildId));
		}
		catch (error) {
			console.log(error);
		}
		commands.push(command.data.toJSON());
		try {
			await rest.put(Routes.applicationGuildCommands(client, guildId), { body: commands });
		}
		catch (error) {
			console.log(error);
		}
	},
};