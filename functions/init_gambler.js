const fs = require('fs');

module.exports = async (client, gambler) => {
    let gamblers = require('../gamblers.json');
    if (!gamblers[gambler.id]) {
        gamblers[gambler.id] = {
            id: gambler.id,
            name: gambler.globalName,
            ecto: 1250,
            gold: 500,
            free: 18706,
            gambles: 0,
            orb: 0,
            jhemonade: 0
        }
        fs.writeFile('./gamblers.json', JSON.stringify(gamblers, null, 4), async (error) => {
            if (error) console.error(error);
        })
    }
    return gamblers[gambler.id];
}
