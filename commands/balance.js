const { SlashCommandBuilder } = require('discord.js');
const init_emojis = require("../functions/init_emojis");
const init_gambler = require("../functions/init_gambler");
const update_gambler = require("../functions/update_gambler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Automatically sell or buy Ectos, so that your Gold and Ectos are  cleanly balanced.'),
        // interaction is a Discord.MessageReaction when inside_job = true, otherwise it is a Discord.Interaction
	async execute(interaction, client, inside_job = false, user) { 
        if (!inside_job) {
            user = interaction.user;
        }
        
        let gambler = await init_gambler(client, user);
        let emojis = await init_emojis(client);
        let ecto = gambler.ecto;

        let total = gambler.gold + gambler.ecto * 0.4;
        let uneven_ectos = total / (2 * 0.4);
        let even = Math.ceil(uneven_ectos / 5) * 5;
        let diff = uneven_ectos - even;

        gambler.gold = (total / 2) + (diff * 0.4);
        gambler.ecto = even;

        let delta_ecto = gambler.ecto - ecto;
        let new_message = "";

        await update_gambler(gambler)

        if (delta_ecto < 0) {
            new_message = `${gambler.name}, you sold ${-1 * delta_ecto}${emojis.ecto} for ${-0.4 * delta_ecto}${emojis.gold}! You now have ${gambler.gold}${emojis.gold} and ${gambler.ecto}${emojis.ecto}.`
        } else if (delta_ecto > 0) {
            new_message = `${gambler.name}, you bought ${delta_ecto}${emojis.ecto} for ${0.4 * delta_ecto}${emojis.gold}! You now have ${gambler.gold}${emojis.gold} and ${gambler.ecto}${emojis.ecto}.`
        } else {
            new_message = `${gambler.name}, your ${emojis.ecto} and ${emojis.gold} are already perfectly balanced, as all things should be.`
        }

        try {
            let sent = null;
            if (inside_job) {
                sent = await interaction.message.channel.send(new_message);
            } else {
                sent = await interaction.reply(new_message);
            }
            setTimeout(() => {
                sent.delete({ timeout: 10000 })
            }, 10000);
        } catch (error) { console.error(error) }
    }
}
