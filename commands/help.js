const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Provides command information about the Jhamble bot.'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`The name's Jhamble, ready to gamble!`)
            .setColor(0xFF0000)
            .setDescription(`**/gamble <amount>** - Ectogambles the declared amount. Defaults to one gamble if amount `+
                    `left empty, max 20 gambles at a time. You can also click on one of the reactions that will appear to gamble.\n `+
                `**/me** - Shows information about yourself. \n `+
                `**/balance** - Evens out ecto and gold amounts, so they have roughly the same value.\n`+
                `**/buy <amount>** - Used for buying ectos if you have too much gold and too few ectos.\n`+
                `**/sell <amount> <what>** - You can sell ectos and orbs if you have too many of those and too little gold.\n`+
                `**/give <@who> <amount> <what>** - If your friend has too few of something, you can help them out. (ectos, orbs, gold, jhemonade)\n`+
                `**/craft <amount>** - Crafts given amount of jhemonade for 50 orbs each!\n`+
                `**/leaderboard** - Shows the current top ecto gamblers (and you if you aren't in the top 5).\n`+
                `**/hallofmonuments** - Shows the ectogambling leaderboard including retired gamblers.\n`+
                `**/retire <@who>** - Retires a gambler if they no longer play and should not be on the leaderboard.`+
                    `(if player is no longer in server, can use their display name instead)` 
            );
        try {
            await interaction.reply({ content: `Sending a DM to you with the Jhamble commands.`, ephemeral: true });
            await interaction.user.send({ embeds: [embed] });
        } catch (error) { console.error(error) }
	},
};
