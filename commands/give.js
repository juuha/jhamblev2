const { SlashCommandBuilder } = require('discord.js');
const init_emojis = require('../functions/init_emojis');
const init_gambler = require('../functions/init_gambler');
const update_gambler = require('../functions/update_gambler');
const gamblers = require('../gamblers.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give Ectos, Gold, Orbs or Jhemonade to someone.')
        .addUserOption(option =>
            option.setName("recipient")
                .setRequired(true)
                .setDescription("Who you want to give something.")
            )
        .addIntegerOption(option =>
            option.setName("amount")
                .setMinValue(1)
                .setRequired(true)
                .setDescription("How many you want to give.")
            )
        .addStringOption(option =>
            option.setName("what")
            .setRequired(true)
            .setDescription("What you want to give.")
            .addChoices(
                { name: "Ectos", value: "ecto" },
                { name: "Gold", value: "gold"},
                { name: "Orbs", value: "orb" },
                { name: "Jhemonade", value: "jhemonade"},
            )),
	async execute(interaction, client) {
        let gambler = await init_gambler(client, interaction.user);
        let emojis = await init_emojis(client);

        let who = interaction.options.getUser("recipient");
        let amount = interaction.options.getInteger("amount");
        let what = interaction.options.getString("what");

        let receiver = {}

        if (gamblers[who.id]) {
            receiver = gamblers[who.id]
        } else {
            receiver = await init_gambler(client, who)
        }

        if (gambler[what] < amount) {
            let error_message = `You can't give what you don't have! You only have ${gambler[what]} ${emojis[what]}!`;
            try {
                await interaction.reply({ content: error_message, ephemeral: true });
            } catch (error) { console.error(error) }
            return;
        }

        gambler[what] -= amount;
        receiver[what] += amount;

        await update_gambler(gambler);
        await update_gambler(receiver);

        let success_message = `${gambler.name} gave <@${receiver.id}> ${amount} ${emojis[what]}!`;
        try {
            await interaction.reply(success_message);
        } catch (error) { console.error(error) }
    }
}
