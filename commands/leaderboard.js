const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const init_emojis = require('../functions/init_emojis');
const init_gambler = require('../functions/init_gambler');
const gamblers = require('../gamblers.json');
const { withCommas } = require('../functions/numbers_with_commas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the ectogambling leaderboard!'),
	async execute(interaction, client, hall_of_monuments) {
        let gambler = await init_gambler(client, interaction.user);
        let leaderboard = [];

        for (let id in gamblers) {
            let g = gamblers[id];
            if (!hall_of_monuments) {
                if (g.retired) continue;
            }
            leaderboard.push({
                name: g.name,
                gold: g.gold,
                ecto: g.ecto,
                orb: g.orb,
                crafted_jhemonade: g.crafted_jhemonade,
                value: g.gold + g.ecto * 0.4 + g.orb * 100 + g.crafted_jhemonade * 5000
            });
        }

        leaderboard = leaderboard.sort((a, b) => (a.value < b.value) ? 1 : -1);
        let max = Math.min(5, leaderboard.length);

        let user_rank = leaderboard.findIndex(g => g.name === gambler.name) + 1;
        let emojis = await init_emojis(client);
        let names = "";
        // Left here in case want to change the format again
        //let gold = "";
        //let ectos = "";
        //let orbs = "";
        let items = "";
        let crafted = "";
        let total_value = "";

        for (let i = 0; i < max; i++) {
            let g = leaderboard[i];
            names += `${i + 1}.\u2800${g.name}\n`;
            // Left here in case want to change the format again
            //gold += `${withCommas(g.gold)}${emojis.gold}\n`;
            //ectos += `${withCommas(g.ecto)}${emojis.ecto}\n`;
            //orbs  +=  `${withCommas(g.orb)}${emojis.orb}\n`;
            items += `${withCommas(g.gold)}${emojis.gold}`+
                `\u2800${withCommas(g.ecto)}${emojis.ecto}`+
                `\u2800${withCommas(g.orb)}${emojis.orb}\n`;
            crafted += `${withCommas(g.crafted_jhemonade)}${emojis.jhemonade}\n`;
            total_value += `${withCommas(g.value)}${emojis.gold}\n`;
        }

        if (user_rank > max) {
            names += `...\n${user_rank}.\u2800${gambler.name}`;
            // Left here in case want to change the format again
            //gold += `...\n${withCommas(gambler.gold)}${emojis.gold}`;
            //ectos += `...\n${withCommas(gambler.ecto)}${emojis.ecto}`;
            //orbs += `...\n${withCommas(gambler.orb)}${emojis.orb}`;
            items += `${withCommas(gambler.gold)}${emojis.gold}`+
                `\u2800${withCommas(gambler.ecto)}${emojis.ecto}`+
                `\u2800${withCommas(gambler.orb)}${emojis.orb}\n`;
            crafted += `...\n${withCommas(gambler.crafted_jhemonade)}${emojis.jhemonade}`;
            total_value += `...\n${withCommas(leaderboard[user_rank-1].value)}${emojis.gold}`;
        }

        let title = !hall_of_monuments ? `${emojis.ecto} Leaderboard ${emojis.ecto}` : `🏛️ Hall of Monuments 🏛️`;

        const embed = new EmbedBuilder()
            .setTitle(title)
            .addFields(
                { name: 'Name', value: names, inline: true },
                { name: `Crafted ${emojis.jhemonade}`, value: crafted, inline: true },
                { name: 'Total value', value: total_value, inline: true },
                { name: 'Gold, Ectos and Orbs', value: items, inline: true},
                // Left here in case want to change the format again
                //{ name: `Gold ${emojis.gold}`, value: gold, inline: true },
                //{ name: `Ectos ${emojis.ecto}`, value: ectos, inline: true },
                //{ name: `Orbs ${emojis.orb}`, value: orbs, inline: true },
            )
            .setColor(0xffd700);

        try {;
            interaction.reply({ embeds: [embed] });
        } catch (error) { console.error(error) };
    }
}
