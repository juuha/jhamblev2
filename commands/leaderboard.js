const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const init_emojis = require('../functions/init_emojis');
const init_gambler = require('../functions/init_gambler');
const gamblers = require('../gamblers.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Show the ectogambling leaderboard!'),
	async execute(interaction, client) {
        let gambler = await init_gambler(client, interaction.user);
        let leaderboard = [];

        for (let id in gamblers) {
            let g = gamblers[id];
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
        let items = "";
        let total_value = "";

        for (let i = 0; i < max; i++) {
            let g = leaderboard[i];
            names += `${i + 1}.\u2800${g.name}\n`;
            items += `${g.gold}${emojis.gold}`+
                `\u2800${g.ecto}${emojis.ecto}`+
                `\u2800${g.orb}${emojis.orb}`+
                `\u2800${g.crafted_jhemonade}${emojis.jhemonade}\n`;
            total_value += `${g.value}${emojis.gold}\n`;
        }

        if (user_rank > max) {
            names += `...\n${user_rank}.\u2800${gambler.name}`;
            items += `\n${gambler.gold}${emojis.gold}`+
                `\u2800${gambler.ecto}${emojis.ecto}`+
                `\u2800${gambler.orb}${emojis.orb}`+
                `\u2800${gambler.crafted_jhemonade}${emojis.jhemonade}`;
            total_value += `\n${leaderboard[user_rank-1].value}${emojis.gold}`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${emojis.ecto} Leaderboard ${emojis.ecto}`)
            .addFields(
                { name: 'Name', value: names, inline: true },
                { name: `Current ${emojis.gold} ${emojis.ecto} ${emojis.orb} & Crafted ${emojis.jhemonade}`, value: items, inline: true },
                { name: 'Total value', value: total_value, inline: true },
            )
            .setColor(0xffd700);

        try {;
            interaction.reply({ embeds: [embed] });
        } catch (error) { console.error(error) };
    }
}
