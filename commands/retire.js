const { SlashCommandBuilder } = require('discord.js');
const update_gambler = require('../functions/update_gambler');
const init_gambler = require("../functions/init_gambler.js");
const gamblers = require('../gamblers.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('retire')
		.setDescription('Retire a player. (They will come out of retirement if they use any Jhamble command)')
        .addUserOption(option =>
            option.setName("retiree")
                .setRequired(true)
                .setDescription("Who you want to retire.")
            ),
	async execute(interaction, client) {
		let who = interaction.options.getUser("retiree");
        let retiree = await init_gambler(client, who)
        retiree.retired = true;
        await update_gambler(retiree);

        let message = `${retiree.name} has been retired.`;
        try {
            await interaction.reply(message);
        } catch (error) { console.error(error) }
	}
}
