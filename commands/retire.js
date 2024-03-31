const { SlashCommandBuilder } = require('discord.js');
const update_gambler = require('../functions/update_gambler');
const init_gambler = require("../functions/init_gambler.js");
const gamblers = require('../gamblers.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('retire')
		.setDescription('Retire a player. (They will come out of retirement if they use any Jhamble command)')
        .addSubcommand(subcommand =>
            subcommand.setName("user")
                .setDescription("Retire the user by mentioning them. (@user)")
                .addUserOption(option =>
                    option.setName("retiree")
                        .setRequired(true)
                        .setDescription("Who you want to retire.")))
        .addSubcommand(subcommand2 =>
            subcommand2.setName("username")
                .setDescription("Retire the user by typing their username.")
                .addStringOption(option =>
                    option.setName("retiree")
                        .setRequired(true)
                        .setDescription("Who you want to retire."))),
	async execute(interaction, client) {
        let whoUsernameString = "";
        let subcommand = "";
        let who = null;
        if (interaction.options._subcommand == "user") {
            who = await interaction.options.getUser("retiree");
            whoUsernameString = who.globalName || who.username;
            subcommand = "user";
        } else {
            whoUsernameString = interaction.options.getString("retiree");
        }

        let gambler = null;
        for (let id in gamblers) {
            let g = gamblers[id];
            if (g.name == whoUsernameString) {
                gambler = g;
                break;
            }
        }

        if (!gambler) {
            let error_message = "";
            if (subcommand == "user") {
                error_message = `${who} is not a gambler!`;
            } else {
                error_message = `No gambler found by the name ${whoUsernameString}!`;
            }
            try {
                await interaction.reply({ 
                    content: error_message,
                    ephemeral: true,
                    "allowed_mentions": {
                        "parse": []
                    }
                });
            } catch (error) { console.error(error) };
            return;
        }

        let retiree = await init_gambler(client, gambler)
        retiree.retired = true;
        await update_gambler(retiree);

        let message = `${retiree.name} has been retired.`;
        try {
            await interaction.reply(message);
        } catch (error) { console.error(error) }
	}
}
