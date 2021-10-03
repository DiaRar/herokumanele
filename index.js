/* eslint-disable brace-style */
const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES'] });
// global.resource = createAudioResource();
client.commands = new Discord.Collection();
client.playlists = new Discord.Collection();
client.players = new Discord.Collection();
client.prefixes = require('./prefixes.json');
// eslint-disable-next-line no-unused-vars
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
		await command.execute(client, interaction, []);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
const defprefix = process.env.PREFIX;
let prefix = defprefix;
client.on('messageCreate', message => {
	if (message.guild) {
		if (!client.prefixes[message.guild.id]) {
			client.prefixes[message.guild.id] = {
				prefixes: defprefix,
			};
			fs.writeFile('./prefixes.json', JSON.stringify(client.prefixes, null, 4), err => {
				if (err) throw err;
			});
		}
		prefix = client.prefixes[message.guild.id].prefixes;
	}
	if (!message.content.startsWith(prefix) || message.author.bot) {
		if (message.mentions.users.first() === client.user) {
			message.channel.send(`My prefix here is \`${prefix}\``);
		}
		return;
	}
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);
	if (!command) {
		return;
	}
	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);