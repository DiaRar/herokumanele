/* eslint-disable brace-style */
const Discord = require('discord.js');
const fs = require('fs');
const sp = require('./exports/spevent');
const allf = require('./exports/functions');
const deploy = require('./deploy-g.js');
require('dotenv').config();
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES'] });
const spev = sp.emitter;
client.commands = new Discord.Collection();
client.gcommands = new Discord.Collection();
client.playlists = new Discord.Collection();
client.players = new Discord.Collection();
client.volumes = new Discord.Collection();
client.prefixes = require('./prefixes.json');
allf.setfiles('commands', client.commands);

client.once('ready', () => {
	client.user.setActivity('/play', { type: 'STREAMING', url: 'https://www.twitch.tv/monstercat' });
	console.log('Ready!');

});


// Interaction event listener


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	const gcommand = client.gcommands.get(interaction.guildId + interaction.commandName);
	if (!command && !gcommand) return;
	if (!gcommand) {
		try {
			await interaction.deferReply();
			await command.execute(client, interaction, []);
		} catch (error) {
			console.error(error);
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} else {
		try {
			await interaction.deferReply();
			await gcommand.execute(client, interaction, []);
		} catch (error) {
			console.error(error);
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


// Start of message ev listener


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

// end of discord, start of listener

// Custom event listener

spev.on('addCommand', async function(data) {
	if (!fs.existsSync(data.guildId)) {
		await fs.mkdirSync(data.guildId);
	}
	try {
		await fs.writeFile(data.guildId + '/' + data.name + 'js', data.code);
	} catch (error) {
		console.log(error);
	}
	const command = require(`./${data.guildId}/${data.name}`);
	deploy.deploy(data.guildId, command);
	client.gcommands.set(data.guildId + data.name, command);
});
spev.on('refreshCommands', async function(guildId) {
	if (!fs.existsSync(guildId))
	{return;}
	allf.setfiles(guildId, client.gcommands);
});