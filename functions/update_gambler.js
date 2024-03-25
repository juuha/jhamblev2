const fs = require('fs');

module.exports = async (gambler) => {
    let gamblers = require('../gamblers.json');
    gamblers[gambler.id] = gambler;
    fs.writeFile('./gamblers.json', JSON.stringify(gamblers, null, 4), async (error) => {;
        if (error) console.error(error);
    })
}
