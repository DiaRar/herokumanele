const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('stops manele'),
	async execute(interaction) {
		global.playlist = [];
		global.player.stop();
		const connection = getVoiceConnection(interaction.guildId);
		connection.destroy();
		await interaction.reply('Ok :(');
	},
};