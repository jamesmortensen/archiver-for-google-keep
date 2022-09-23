#!/usr/bin/env node

const args = require('argumently');


if (args.hasHelp()) {
    require('./src/help');
    process.exit(0);
}

if(args.has('--version') || args.has('-v')) {
    console.log(`v${require('./package.json').version}`);
    process.exit(0);
}

try {
    require('./keep.js');
} catch(e) {
    console.error('Error: ' + e.message);
}
