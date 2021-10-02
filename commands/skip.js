const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skips a song'),
	async execute(interaction) {
		if (global.playlist.length > 1) {await interaction.reply('Now playing: ' + global.playlist[1].url);}
		global.player.stop();

	},
};