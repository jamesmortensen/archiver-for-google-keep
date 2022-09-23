// help.js

const PACKAGE = require('../package.json');
const BINARY = Object.keys(PACKAGE.bin)[0];

console.log(`
Usage: 
    ${BINARY} [[-h|--help]]

    -h | --help        Help (this output)

    -v | --version     Output version information

    `);
