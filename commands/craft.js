const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const init_emojis = require("../functions/init_emojis.js");
const init_gambler = require('../functions/init_gambler.js');
const update_gambler = require("../functions/update_gambler");
const { withCommas } = require('../functions/numbers_with_commas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('craft')
		.setDescription('Crafts Jhemonade. By default crafts one.')
        .addIntegerOption(option =>
            option.setName("amount")
                .setMinValue(1)
                .setDescription("How many Jhemonades you want to craft.")),
	async execute(interaction, client, count = 1) {
        let gambler = await init_gambler(client, interaction.user);
        let emojis = await init_emojis(client);

        count = interaction.options.getInteger("amount");
        count = count ? count : 1;

        let error_message = "";
        if (gambler.orb < 50 * count) {
            error_message = `To craft ${withCommas(count)} ${emojis.jhemonade} you need ${withCommas(50 * count)} ${emojis.orb}, but you only have ${withCommas(gambler.orb)} ${emojis.orb}!`;
        }

        if (error_message) {
            try {
                await interaction.reply({ content: error_message, ephemeral: true });
            } catch (error) { console.error(error) }
            return
        }

        gambler.orb -= 50 * count;
        gambler.jhemonade += 1 * count;
        gambler.crafted_jhemonade += 1 * count;

        await update_gambler(gambler);

        try {
            await interaction.reply(`${interaction.user.globalName} crafted ${withCommas(count)} ${emojis.jhemonade}!`);
        } catch (error) { console.error(error) }
    }
}
