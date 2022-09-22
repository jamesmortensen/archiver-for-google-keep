// json-generator.js

function generateJSON(card, filename, outputFolder = 'output') {
    const fs = require('fs');
    return JSON.stringify(card);
}

module.exports = generateJSON;
