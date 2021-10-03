const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skips a song'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, args) {
		const playlist = client.playlists.get(interaction.guildId);
		const player = client.players.get(interaction.guildId);
		if (playlist.length > 1) {await interaction.reply('Now playing: ' + playlist[1].url);}
		else {
			await interaction.reply('Ok :(');
		}
		player.stop();
	},
};