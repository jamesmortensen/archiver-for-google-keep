// card-date-parser.js

function convertToMonthDateCommaYear(dateStr, dateTimeNow = new Date()) {
    const matcher = '([A-Za-z]{3}){1} ([0-9][0-9]?)$|([A-Za-z]{3}){1} ([0-9][0-9]?){1}, ([0-9][0-9][0-9][0-9])?|[0-9]?[0-9]:[0-9][0-9] ([AP]M)';
    const response = dateStr.match(matcher);

    if (response === null || response === undefined)
        throw new Error('Not a valid date string.');

    if (isMonthAndDate(response))
        return response[1] + ' ' + response[2] + ', ' + dateTimeNow.getFullYear();

    else if (isMonthDateAndYear(response))
        return response[0];

    else if(isYesterday(response))
        return getMonthDateAndYear(new Date(new Date().setDate(dateTimeNow.getDate() - 1)));

    else if (isATime(response))
        return getMonthDateAndYear(dateTimeNow);
}

function isMonthAndDate(response) {
    return response[1] && response[2];
}

function isMonthDateAndYear(response) {
    return response[3] && response[4] && response[5];
}

function isYesterday(response) {
    return response.input.split(', ')[0].toLowerCase() === 'yesterday';
}

function isATime(response) {
    return response[6];
}

function getMonthDateAndYear(dateTimeNow) {
    var todayDate = dateTimeNow;
    const month = getMonthName(todayDate.getMonth());
    const date = todayDate.getDate();
    const year = todayDate.getFullYear();
    return month + ' ' + date + ', ' + year;
}

function getMonthName(mo) {
    throwErrorIfInvalidMonthNum(mo);

    //mo = mo - 1; // Adjust month number for array index (1 = Jan, 12 = Dec)
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
        'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months[mo];
}

function throwErrorIfInvalidMonthNum(mo) {
    if (typeof (mo) !== 'number' || mo / parseInt(mo) !== 1 || (mo < 1 || mo > 12))
        throw 'InvalidMonthNo: ' + mo + ' is not valid. The argument must be an integer from 1 to 12'; // throw keyword is used here
}


(function (func) {
    if (process.argv[1].match('mocha') === null)
        module.exports = function (input) {
            return func(input, new Date());
        }
    else {
        console.warn('CLI loaded by mocha. Enable passing in dateTimeNow as 2nd argument...');
        module.exports = function (input, dateTimeNow) {
            return func(input, dateTimeNow);
        }
    }
})(convertToMonthDateCommaYear);
