// time-parser.spec.js

const { expect } = require('chai');

const convertToMonthDateCommaYear = require('../src/card-date-parser.js');

describe('Time Parser Tests', () => {

    const dateTimeNow = new Date('Oct 19, 2022');

    it('should make sure the current year is added to the string if there is only month and date', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('Jul 6', new Date('Oct 19, 2022'));
        expect(lastEditedDateStr).to.equal('Jul 6, 2022');
    });

    it('should return the input string if month, date, and year are present', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('Jul 6, 2020', dateTimeNow);
        expect(lastEditedDateStr).to.equal('Jul 6, 2020');
    });

    it('should make sure the current date is used if the input is a PM time', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('10:24 PM', dateTimeNow);
        expect(lastEditedDateStr).to.equal('Oct 19, 2022');
    });

    it('should make sure the current date is used if the input is an AM time', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('10:24 AM', new Date('Jul 6, 2022'));
        expect(lastEditedDateStr).to.equal('Jul 6, 2022');
    });

    it('should make sure the current date is used if the input is an AM time with 1 digit hour', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('1:24 AM', new Date('Jul 6, 2022'));
        expect(lastEditedDateStr).to.equal('Jul 6, 2022');
    });

    it('should handle if the last edited time is yesterday', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('yesterday, 3:03 PM', new Date('June 20, 2023'));
        expect(lastEditedDateStr).to.equal('Jun 19, 2023');
    });

    it('should handle if the last edited time is the day before yesterday', () => {
        const lastEditedDateStr = convertToMonthDateCommaYear('Jun 19', new Date('June 21, 2023'));
        expect(lastEditedDateStr).to.equal('Jun 19, 2023');
    });

    it('should throw Error if minute is invalid', () => {
        expect(
            () => convertToMonthDateCommaYear('10:2 AM', new Date('Jul 6, 2022'))
        ).to.throw(Error, 'Not a valid date string.');
    });

    it('should throw Error if AM/PM is missing', () => {
        expect(
            () => convertToMonthDateCommaYear('10:24', new Date('Jul 6, 2022'))
        ).to.throw(Error, 'Not a valid date string.');
    });

    it('should throw Error if hour is missing', () => {
        expect(
            () => convertToMonthDateCommaYear(':24', new Date('Jul 6, 2022'))
        ).to.throw(Error, 'Not a valid date string.');
    });
});
