const { SlashCommandBuilder } = require('@discordjs/builders');
const ismessage = require('../exports/functions');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('skips a song'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, args) {
		const playlist = client.playlists.get(interaction.guildId);
		let msg;
		const player = client.players.get(interaction.guildId);
		if (playlist && player) {
			if (playlist.length > 1) {
				msg = 'Now playing: ' + playlist[1].url;
			}
			else {
				msg = 'Ok :(';
			}
			player.stop();
		}
		else {
			msg = 'There are no songs playing atm';
		}
		ismessage.verify(interaction, msg);
	},
};