/* eslint-disable brace-style */
const Discord = require('discord.js');
const fs = require('fs');
const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
require('dotenv').config();
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES'] });
global.player = createAudioPlayer();
global.playlist = [];
let resource;
// global.resource = createAudioResource();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
// When the client is ready, run this code (only once)
client.once('ready', () => {
	client.user.setActivity('/play', { type: 'STREAMING', url: 'https://www.twitch.tv/monstercat' });
	console.log('Ready!');

});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
global.player.on(AudioPlayerStatus.Idle, () => {
	global.playlist.shift();
	if (global.playlist.length) {
		resource = createAudioResource(global.playlist[0].trueurl);
		global.player.play(resource);
	}
});
// Login to Discord with your client's token
client.login(process.env.TOKEN);