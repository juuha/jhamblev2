const Discord = require('discord.js');

module.exports = async (client) => {
    let emojis = {};

    emojis.ecto = "🎲";
    const ecto_emoji = client.emojis.cache.find(emoji => emoji.name === 'ecto');
    if (ecto_emoji) emojis.ecto = ecto_emoji;
    
    emojis.gold = "🏅";
    const gold_emoji = client.emojis.cache.find(emoji => emoji.name === 'gold');
    if (gold_emoji) emojis.gold = gold_emoji;

    emojis.orb = "🔮";
    const orb_emoji = client.emojis.cache.find(emoji => emoji.name === "orb");
    if (orb_emoji) emojis.orb = orb_emoji;

    emojis.crystal = "💎";
    const crystal_emoji = client.emojis.cache.find(emoji => emoji.name === "crystal");
    if (crystal_emoji) emojis.crystal = crystal_emoji;

    emojis.glob = "🔅";
    const glob_emoji = client.emojis.cache.find(emoji => emoji.name === "glob");
    if (glob_emoji) emojis.glob = glob_emoji;

    emojis.asc_glob = "🔆";
    const asc_glob_emoji = client.emojis.cache.find(emoji => emoji.name === "asc_glob");
    if (asc_glob_emoji) emojis.asc_glob = asc_glob_emoji;

    emojis.jhemonade = "🍹";
    emojis.balance = "⚖️";

    return emojis;
}
