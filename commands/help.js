const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides command information about the Jhamble bot.'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`The name's Jhamble, ready to gamble!`)
            .setColor(0xFF0000)
            .setDescription(`**/gamble <amount>** - Ectogambles the declared amount. Amount can be left empty if only gambling once. \n **/me** - Shows information about yourself.\n **/buy <amount>** - Used for buying ectos if you have too much gold and too few ectos.\n**/sell <amount> <what>** - You can sell ectos and orbs if you have too many of those and too little gold. \n**/give <@who> <amount> <what>** - If your friend has too little of something, you can give them something. (ectos, orbs, gold, jhemonade)\n**/craft <amount>** - Crafts 1 jhemonade using 50 orbs!\n**/leaderboard** - Shows the current top ecto gamblers (and you if you aren't in the top 5).\n**/balance** - Evens out ecto and gold amounts, so they have the same value.\n\n\n`);
        try {
            await interaction.reply({ content: `Sending a DM to you with the Jhamble commands.`, ephemeral: true });
            await interaction.user.send({ embeds: [embed] });
        } catch (error) { console.error(error) }
	},
};
