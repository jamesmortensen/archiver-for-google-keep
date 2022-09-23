// json-generator.spec.js

const { expect } = require('chai');

describe('JSON File Generator Tests', () => {

    const generators = require('../generators.js');
    const card = {
        title: "ScrumMaster initiatives",
        lastEditedTime: "Edited Jan 6, 2019",
        createdTime: "Created Jan 6, 2019",
        labels: ["Ideas","Scrum"],
        isPinned: false,
        color: "rgb(255, 255, 255)",
        keepUrl: "https://keep.google.com/#LIST/<redacted>"
    };

    it('should generate a simple JSON card', () => {
        let cardAsJSON;
        generators.forEach(({ generate, ext }) => {
            if(ext === '.json')
                cardAsJSON = generate(card);
        });
        expect(cardAsJSON).to.be.a('string');
        expect(
            JSON.parse(cardAsJSON), 
            'string representation of card is not valid JSON as it cannot be parsed'
        ).to.be.an('object');
        expect(JSON.parse(cardAsJSON).title).to.equal('ScrumMaster initiatives');
        expect(JSON.parse(cardAsJSON).lastEditedTime).to.equal('Edited Jan 6, 2019');
        expect(JSON.parse(cardAsJSON).createdTime).to.equal('Created Jan 6, 2019');
        expect(JSON.parse(cardAsJSON).labels[0]).to.equal('Ideas');
        expect(JSON.parse(cardAsJSON).labels[1]).to.equal('Scrum');
        expect(JSON.parse(cardAsJSON).isPinned).to.equal(false);
        expect(JSON.parse(cardAsJSON).color).to.equal('rgb(255, 255, 255)');
        expect(JSON.parse(cardAsJSON).keepUrl).to.equal('https://keep.google.com/#LIST/<redacted>');
    });
});