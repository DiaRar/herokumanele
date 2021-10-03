const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stops manele'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, args) {
		const playlist = [];
		const player = client.players.get(interaction.guildId);
		client.playlists.set(interaction.guildId, playlist);
		player.stop();
		await interaction.reply('Ok :(');
	},
};