// generators.js

/*
To write to new file types, add the generator function and file extension here.
Then create a ${file-type}-generator.js function in the src folder.
*/

const generateCardMarkdown = require('./src/markdown-generator.js');
const generateJSON = require('./src/json-generator.js');

const generators = [
    {
        generate: generateCardMarkdown,
        ext: '.md'
    },
    {
        generate: generateJSON,
        ext: '.json'
    }
];

module.exports = generators;
