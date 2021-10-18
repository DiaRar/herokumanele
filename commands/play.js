const { SlashCommandBuilder } = require('@discordjs/builders');
const yts = require('yt-search');
const { joinVoiceChannel, createAudioResource, getVoiceConnection, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const validUrl = require('valid-url');
const ismessage = require('../exports/functions');
const { Interaction } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('plays a song')
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Se stie, url sau numele melodiei')
				.setRequired(true)),
	async execute(client, interaction, args) {
		const init = interaction;
		if (!(interaction instanceof Interaction))interaction = await interaction.reply('Loading video');
		let video, channel, resource, connection, potato = true, playlist = client.playlists.get(interaction.guildId), msg;
		if (!args.length) video = interaction.options.get('title').value; else video = args.join(' ');
		// console.log(interaction.options);
		const vedeo = {};
		// setting video info
		if (validUrl.isUri(video)) {
			vedeo.url = video;
			vedeo.title = video;
		}
		else {
			const videos = await yts(video);
			if (videos.videos[0]) {
				vedeo.url = videos.videos[0].url;
				vedeo.title = videos.videos[0].title;
			}
			else {
				// fallback
				vedeo.trueurl = 'C:/Users/diaco/discord/xp.mp3'; vedeo.url = 'Easter egg';
				vedeo.title = 'windows xp sound'; potato = false;
			}
		}
		if (!playlist) {
			playlist = [];
		}
		if (init.member.voice.channelId) {
			if (!playlist.length) {
				msg = { content : 'Now playing: ' + vedeo.url };
			}
			else {
				msg = { content: 'Added to queue: ' + vedeo.url };
			}
			channel = init.member.voice.channelId;
			connection = getVoiceConnection(interaction.guildId);
			if (!connection) {
				connection = joinVoiceChannel({
					channelId: channel,
					guildId: interaction.guildId,
					adapterCreator: interaction.guild.voiceAdapterCreator,
				});
			}
			if (potato === true) {
				try {
					// getting audiourl through youtube-dl
					const { stdout } = await exec('youtube-dl -f bestaudio -o %(title)s.%(ext)s ' + vedeo.url + ' --get-url');
					vedeo.trueurl = stdout;
				}
				catch (e) {
					console.log(e);
					msg = 'Bruh, only use youtube links plz, if you dont know the link use the title of the video';
					ismessage.verify(interaction, msg);
					connection.destroy();
					return;
				}

			}
			ismessage.verify(interaction, msg);
			// tldr player check
			let player = client.players.get(interaction.guildId);
			if (!player) {
				player = createAudioPlayer();
				player.on(AudioPlayerStatus.Idle, () => {
					const splaylist = client.playlists.get(interaction.guildId);
					splaylist.shift();
					if (splaylist.length) {
						resource = createAudioResource(splaylist[0].trueurl, { inlineVolume: true });
						player.play(resource);
						client.playlists.set(interaction.guildId, splaylist);
					}
					else {
						player.stop();
						client.players.delete(interaction.guildId);
						client.playlists.delete(interaction.guildId);
						getVoiceConnection(interaction.guildId).destroy();
					}
				});
				client.players.set(interaction.guildId, player);
			}
			if (!playlist.length) {
				resource = createAudioResource(vedeo.trueurl, { inlineVolume: true });
				console.log(resource);
				player.play(resource);
				connection.subscribe(player);
			}
			playlist.push(vedeo);
			client.playlists.set(interaction.guildId, playlist);
		}
		else {
			msg = 'Please go to a voice channel!';
			ismessage.verify(interaction, msg);
		}

	},
};