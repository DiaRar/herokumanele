const { SlashCommandBuilder } = require('@discordjs/builders');
const ismessage = require('../exports/functions');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stops manele'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, args) {
		const playlist = [];
		const player = client.players.get(interaction.guildId);
		client.playlists.set(interaction.guildId, playlist);
		if (player) {player.stop();}
		ismessage.verify(interaction, 'Ok :(');
	},
};