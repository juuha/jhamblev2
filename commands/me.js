const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const init_emojis = require("../functions/init_emojis.js");
const init_gambler = require('../functions/init_gambler.js');
const { withCommas } = require('../functions/numbers_with_commas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('me')
		.setDescription('Show information about your-Ectogambling-self.'),
    // interaction is a Discord.MessageReaction when inside_job = true, otherwise it is a Discord.Interaction
	async execute(interaction, client, inside_job = false, user) {
        if (!inside_job) {
            user = interaction.user;
        }
        let gambler = await init_gambler(client, user, unretire = true);
        let emojis = await init_emojis(client);
        let info = `Gold ${emojis.gold}: ${withCommas(gambler.gold)}\nEctos ${emojis.ecto}: ${withCommas(gambler.ecto)}`;

        let today = Math.floor(Date.now() / 86400000);
        if (gambler.free < today) {
            info += `\nFree gamble: Available now!`;
        } else {
            let tomorrow = (today + 1) * 86400000;
            let time_remaining = msToTime(tomorrow - Date.now());
            info += `\nFree gamble: Available in ${time_remaining}!`;
        }

        info += `\nTotal gambles: ${withCommas(gambler.gambles)}`;

        if (gambler.orb) {
            info += `\nOrbs ${emojis.orb}: ${withCommas(gambler.orb)}`;
        }

        if (gambler.jhemonade) {
            info += `\nJhemonade ${emojis.jhemonade}: ${withCommas(gambler.jhemonade)}`;
        }

        if (gambler.crafted_jhemonade) {
            info += `\nTotal crafted ${emojis.jhemonade}: ${withCommas(gambler.crafted_jhemonade)}`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${gambler.name} ${emojis.ecto}`)
            .setColor(0x00FFFF)
            .setDescription(info);
        try {
            if (inside_job) {
                await interaction.message.channel.send({ embeds: [embed] });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) { console.error(error) }
    }
}

function msToTime(duration) {
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let total = "";
    if (hours) { 
        if (hours == 1) {
            total +=  "1  hour ";
        } else {
            total += hours + " hours ";
        }
    }
    if (minutes == 1) {
        total += "1 minute";
    } else {
        total += minutes + " minutes";
    }

    return total;
}