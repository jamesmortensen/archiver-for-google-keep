// markdown-generator.spec.js

const { expect } = require('chai');

describe('Markdown File Generator Tests', () => {

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

    it('should generate a simple Markdown card', () => {
        let cardAsMarkdown;
        generators.forEach(({ generate, ext }) => {
            if(ext === '.md')
                cardAsMarkdown = generate(card);
        });
        expect(cardAsMarkdown).to.contain('ScrumMaster initiatives');
        expect(cardAsMarkdown).to.contain('Edited Jan 6, 2019');
        expect(cardAsMarkdown).to.contain('Created Jan 6, 2019');
        expect(cardAsMarkdown).to.contain(['Ideas','Scrum']);
        expect(cardAsMarkdown).to.contain(false);
        expect(cardAsMarkdown).to.contain('rgb(255, 255, 255)');
        expect(cardAsMarkdown).to.contain('https://keep.google.com/#LIST/<redacted>');
    });
});