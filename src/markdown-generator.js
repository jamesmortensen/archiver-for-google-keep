// markdown-generator.js

function generateCardMarkdown(card) {
    
return `---
title: "${card.title}"
lastEditedTime: ${card.lastEditedTime}
createdTime: ${card.createdTime}
labels: ${card.labels}
isPinned: ${card.isPinned}
color: ${card.color}
keepUrl: ${card.keepUrl}
---

${typeof card.body === 'object'
? generateMarkdownCheckboxes(card.body)
: card.body}
`;
}

function generateMarkdownCheckboxes(body) {
    return body.reduce((acc, listItem) => {
        acc += (listItem.checked ? '- [X] ' : '- [ ] ') + listItem.value + '\n';
        return acc;
    }, '');
}

module.exports = generateCardMarkdown;
