const fs = require('fs');
const update_gambler = require('./update_gambler');

module.exports = async (client, user, unretire = false) => {
    let gamblers = require('../gamblers.json');
    if (!gamblers[user.id]) {
        gamblers[user.id] = {
            id: user.id,
            name: user.globalName || user.username,
            ecto: 1250,
            gold: 500,
            free: 18706,
            gambles: 0,
            orb: 0,
            jhemonade: 0,
            crafted_jhemonade: 0,
            retired: false,
        }
        fs.writeFile('./gamblers.json', JSON.stringify(gamblers, null, 4), async (error) => {
            if (error) console.error(error);
        })
    }
    let gambler = gamblers[user.id];
    if (unretire) {
        gambler.retired = false;
        update_gambler(gambler);
    }
    return gambler;
}
