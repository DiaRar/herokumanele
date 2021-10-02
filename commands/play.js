const { SlashCommandBuilder } = require('@discordjs/builders');
const yts = require('yt-search');
const { joinVoiceChannel, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const validUrl = require('valid-url');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('plays a song')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Se stie, url sau numele melodiei')
				.setRequired(true)),
	async execute(interaction) {
		const video = interaction.options.get('name');
		let potato = true;
		let channel;
		const vedeo = {};
		let resource;
		let connection;
		if (validUrl.isUri(video.value)) {
			vedeo.url = video.value;
			vedeo.title = video.value;
		}
		else {
			const videos = await yts(video.value);
			if (videos.videos[0]) {
				vedeo.url = videos.videos[0].url;
				vedeo.title = videos.videos[0].title;
			}
			else {
				vedeo.trueurl = 'C:/Users/diaco/discord/xp.mp3'; vedeo.url = 'Easter egg';
				vedeo.title = 'windows xp sound'; potato = false;
			}
		}

		if (interaction.member.voice) {
			if (!global.playlist.length) await interaction.reply({ content : 'Now playing: ' + vedeo.url }); else await interaction.reply({ content: 'Added to queue: ' + vedeo.url });
			channel = interaction.member.voice.channelId;
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
					const { stdout } = await exec('youtube-dl -f bestaudio -o %(title)s.%(ext)s ' + vedeo.url + ' --get-url');

					vedeo.trueurl = stdout;
				}
				catch (e) {
					console.log(e);
				}

			}

			if (!global.playlist.length) {
				resource = createAudioResource(vedeo.trueurl);
				global.player.play(resource);
				connection.subscribe(global.player);
			}
			global.playlist.push(vedeo);
		}

	},
};