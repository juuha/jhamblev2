const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hallofmonuments')
		.setDescription('Show the ectogambling Hall of Monuments! (Leaderboard with retired gamblers)'),
	async execute(interaction, client) {
		client.commands.get('leaderboard').execute(interaction, client, hall_of_monuments = true);
	}
}
