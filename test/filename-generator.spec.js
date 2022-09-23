// filename-generator.spec.js

const { expect } = require('chai');

describe('Filename Generator Tests', () => {

    const generateFilename = require('../src/filename-generator.js');

    it('should generate a filename with date 23 Sep if title is empty string', () => {
        const filename = generateFilename('', new Date('Sep 23, 2022').getTime());
        expect(filename).to.equal('untitled-1663871400000');
    });

    it('should generate a filename with date 23 Sep if title is null', () => {
        const filename = generateFilename(null, new Date('Sep 23, 2022').getTime());
        expect(filename).to.equal('untitled-1663871400000');
    });

    it('should generate a filename with date 23 Sep if title is undefined', () => {
        const filename = generateFilename(undefined, new Date('Sep 23, 2022').getTime());
        expect(filename).to.equal('untitled-1663871400000');
    });

    it('should generate a filename with a simple string and in lowercase', () => {
        const filename = generateFilename('Abcdefg', new Date('Sep 23, 2022').getTime());
        expect(filename).to.equal('abcdefg');
    });

    it('should generate a filename but cutoff at 170 chars and make it lowercase', () => {
        const chars175 = 'AbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxyAbcdefghijklmnopqrstuvwxy';
        const chars170 = 'abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrst';
        const filename = generateFilename(chars175, new Date('Sep 23, 2022').getTime());
        expect(filename).to.equal(chars170);
    });

    it('should generate a filename when title contains a simple url', () => {
        const filename = generateFilename('https://example.com/this-is-a-url', new Date('Sep 23, 2022').getTime());
        console.log(filename)
        expect(filename).to.equal('https---example.com--this-is-a-url');
    });

    // filenames actually can't contain & and hashes.
    xit('should generate a filename when title contains a url with query parameters', () => {
        const filename = generateFilename('https://example.com/this-is-a-url?with=query&strings=and#hash', new Date('Sep 23, 2022').getTime());
        console.log(filename)
        expect(filename).to.equal('https---example.com--this-is-a-url?with--eq--query--amp--strings--eq--and--hash--hash');
    });
});