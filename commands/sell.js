const { SlashCommandBuilder } = require('discord.js');
const init_gambler = require('../functions/init_gambler.js');
const update_gambler = require('../functions/update_gambler.js');
const init_emojis = require("../functions/init_emojis.js");
const { withCommas } = require('../functions/numbers_with_commas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell Ectos or Orbs.')
        .addIntegerOption(option =>
            option.setName("amount")
                .setMinValue(1)
                .setRequired(true)
                .setDescription("How many you want to sell.")
        )
        .addStringOption(option =>
            option.setName("what")
            .setRequired(true)
            .setDescription("What you want to sell.")
            .addChoices(
                { name: "Ectos", value: "ecto" },
                { name: "Orbs", value: "orb" },
            )),
	async execute(interaction, client) {
        let what = interaction.options.getString("what");
        let amount = interaction.options.getInteger("amount");

        let gambler = await init_gambler(client, interaction.user, unretire = true);
        let emojis = await init_emojis(client);

        if (gambler[what] < amount) {
            let error_message = `You only have ${withCommas(gambler[what])} ${emojis[what]}.`;
            try {
                await interaction.reply({ content: error_message, ephemeral: true });
            } catch (error) { console.error(error) }
            return;
        }

        price = { "ecto": 0.4, "orb": 100 };

        gambler[what] -= amount;
        gambler.gold += amount * price[what];

        await update_gambler(gambler);

        let message = `${withCommas(amount)} ${emojis[what]} sold for ${withCommas(amount * price[what])} ${emojis.gold}.`;
        try {
            await interaction.reply({ content: message, ephemeral: true });
        } catch (error) { console.error(error) }
    }
}
