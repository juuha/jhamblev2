const { SlashCommandBuilder } = require('discord.js');
const init_emojis = require("../functions/init_emojis.js");
const init_gambler = require("../functions/init_gambler.js");
const update_gambler = require("../functions/update_gambler.js");
const { withCommas } = require('../functions/numbers_with_commas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy given amount of Ectos.')
        .addIntegerOption(option =>
            option.setName("amount")
                .setMinValue(1)
                .setRequired(true)
                .setDescription("How many you want to buy.")),
	async execute(interaction, client) {
        let amount = interaction.options.getInteger("amount");
        let gambler = await init_gambler(client, interaction.user);
        let emojis = await init_emojis(client);
        let price = 0.4;

        if (gambler.gold < amount * price) {
            let error_message = `${withCommas(amount)} ${emojis.ecto} would cost ${withCommas(amount * price)} ${emojis.gold}. You only have ${withCommas(gambler.gold)} ${emojis.gold}.`;
            try {
                await interaction.reply({ content: error_message, ephemeral: true });
            } catch (error) { console.error(error) }
            return;
        }

        gambler.ecto += amount;
        gambler.gold -= amount * price;

        await update_gambler(gambler);

        let message = `${withCommas(amount)} ${emojis.ecto} bought for ${withCommas(amount * price)} ${emojis.gold}.`;
        try {
            await interaction.reply({ content: message, ephemeral: true });
        } catch (error) { console.error(error) }
    }
}
