const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('pentru manelistul din tine'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, args) {
		let i;
		const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Sa cante muzica')
			.setAuthor('Manele Certified', 'https://play-lh.googleusercontent.com/M572-7bHBbzHVtDH2EC61Z0PuQLGYFslwWdwrxvqEjf9hBBTeTTkyx4deyaPHsJz8lg', 'https://www.youtube.com/watch?v=s5_5ua03X0k')
			.setDescription('Toate melodiile care o sa fie puse aici sunt')


			.setTimestamp()
			.setFooter('Legend', interaction.member.user.defaultAvatarURL);
		const playlist = client.playlists.get(interaction.guildId);
		if (!playlist) {
			exampleEmbed.addField('Esti taran', 'Nu ai muzica');
			await interaction.reply({ embeds: [exampleEmbed] });
			return;
		}
		if (playlist.length) exampleEmbed.addField('Now playing: ', playlist[0].title); else exampleEmbed.addField('Now playing: ', 'nothingness');
		if (playlist.length > 1) {exampleEmbed.addField('In queue: ', '1. ' + playlist[1].title);}
		for (i = 2; i < playlist.length; i++) {
			exampleEmbed.fields[1].value = exampleEmbed.fields[1].value.concat('\n', i.toString(), '. ', playlist[i].title);
		}
		await interaction.reply({ embeds: [exampleEmbed] });
	},
};