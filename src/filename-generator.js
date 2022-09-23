// filename-generator.js

function generateFilename(title, dateTimeNow) {
    if(title === null || title === undefined)
        title = '';
    let filename = title === ''
        ? 'untitled-' + dateTimeNow
        : title;
    if (filename.match(/href="(.*)"/) !== null)
        filename = filename.match(/href="(.*)"/)[1];
    filename = filename
        .split(' ')
        .map((word) => word.toLowerCase())
        .reduce((filename, word) => {
            filename += '-' + word;
            return filename;
        })
        .replace('://', '---').split('/').join('--');
    let filenameBefore = filename;
    do {
        filenameBefore = filename;
        filename = filename
            .replace('://', '---')
            .replace('=', '--eq--')
            .split('/')
            .join('-');
    } while (filenameBefore !== filename);

    // limit file size to arbitrary 170 character limit to avoid hitting errno: -63 ENAMETOOLONG errors
    filename = filename.substring(0, 170);
    console.log(filename);
    return filename;
}

(function () {
    if (process.argv[1].match('mocha') === null)
        module.exports = function (title) {
            return generateFilename(title, new Date().getTime());
        }
    else {
        console.warn('CLI loaded by mocha. Enable passing in dateTimeNow as 2nd argument...');
        module.exports = function (title, dateTimeNow) {
            return generateFilename(title, dateTimeNow);
        }
    }
})();
