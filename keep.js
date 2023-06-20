const { remote } = require('webdriverio');
const fs = require('fs');

console.log(`${process.cwd()}/devtools-data-dir`);
if(fs.existsSync('./output'))
    throw new Error('./output folder exists. Remove or rename it and try again.');

(async () => {
    const browser = await initializeBrowser();
    await browser.url('https://keep.google.com');
    await waitForPageToLoad(browser);

    const input = await getInputFromPrompt();
    if (input.toLowerCase() === 'q') {
        console.log('aborting backup...');
        await browser.deleteSession();
        return;
    }

    const startTimeInMillis = new Date().getTime();

    await scrollToBottom(browser);
    const cards = await scrapeCardsFromBrowser(browser);
    await browser.deleteSession();

    const outputFolder = './output';
    writeCardsToOutputFolder(cards, outputFolder);

    const stopTimeInMillis = new Date().getTime();
    const totalTimeInSeconds = parseInt((stopTimeInMillis - startTimeInMillis) / 1000);

    console.log('Total cards processed: ' + cards.length);
    console.log('Total processing time: ' + totalTimeInSeconds + ' seconds');
})().catch((e) => console.error(e));


async function initializeBrowser() {
    const KEEP_DATA_DIR = process.env.KEEP_DATA_DIR || `${process.cwd()}/devtools-data-dir`;
    if(!fs.existsSync(KEEP_DATA_DIR))
        fs.mkdirSync(KEEP_DATA_DIR);
    return await remote({
        logLevel: 'trace',
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: [`--user-data-dir=${KEEP_DATA_DIR}`]
            },
            'wdio:devtoolsOptions': {
                ignoreDefaultArgs: ['--enable-automation'],
            }
        }
    });
}

async function waitForPageToLoad(browser) {
    await browser.pause(8000);
    await browser.$("#gb > div.gb_Ld.gb_2d.gb_Rd > div.gb_Kd.gb_Ud.gb_Ne.gb_Ce.gb_Je.gb_De > div.gb_qe.gb_oe > div.Q0hgme-Yygnk-m5SR9c.gb_te.gb_re.gb_8c > div.Q0hgme-n5T17d-woLtV")
        .waitForDisplayed({ timeout: 45000, reverse: true });
}

async function getInputFromPrompt() {
    const prompt = require('prompt');
    prompt.start();

    console.log(`
    ATTENTION: Please follow these steps to export/backup your data
    1. Login to Google Keep
    2. Click on the label you wish to backup.
    3. Press ENTER to start the backup (or press 'q' to quit).
    `)
    const userInputObj = await prompt.get(['Continue with the backup? (Press ENTER)']);
    const userInput = Object.values(userInputObj)[0];
    prompt.stop();
    return userInput;
}

async function scrollToBottom(browser) {
    let previousScrollY = 0;
    let currentScrollY = 0;
    let numberOfTrueResultsInARow = 0;
    await browser.waitUntil(async () => {
        currentScrollY = await browser.execute(() => {
            window.scrollTo(100000, 100000);
            return window.scrollY;
        });
        if (previousScrollY === currentScrollY)
            return ++numberOfTrueResultsInARow >= 3;
        else {
            previousScrollY = currentScrollY;
            numberOfTrueResultsInARow = 0;
            return false;
        }
    }, { timeout: 180000, interval: 500 })
}

async function scrapeCardsFromBrowser(browser) {
    const cards = [];
    const totalNumberOfCards = await browser.$$("body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-Iu19ad > div.RfDI4d-bN97Pc.ogm-kpc > div.gkA7Yd-sKfxWe.ma6Yeb-r8s4j-gkA7Yd > div > div.IZ65Hb-n0tgWb.IZ65Hb-WsjYwc-nUpftc.RNfche").length;
    console.log('total cards = ' + totalNumberOfCards);
    let count = totalNumberOfCards;
    while (count > 0) {
        console.log('Processing item number ' + (count - 1));

        /*
         * if the body has hyperlinks in the card, sometimes the link gets clicked instead of 
         * opening the card. The workaround is to use browser.execute instead of browser.$$
         */
        await browser.execute((count) => {
            document.querySelectorAll(`body > div.notes-container.RfDI4d-sKfxWe > div.RfDI4d-Iu19ad > div.RfDI4d-bN97Pc.ogm-kpc > div.gkA7Yd-sKfxWe.ma6Yeb-r8s4j-gkA7Yd > div > div.IZ65Hb-n0tgWb.IZ65Hb-WsjYwc-nUpftc.RNfche`)[count].click();
        }, --count);

        await browser.pause(500);
        const title = await browser.$("body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied > div.IZ65Hb-s2gQvd > div.IZ65Hb-r4nke-haAclf > div.notranslate.IZ65Hb-YPqjbf.fmcmS-x3Eknd.r4nke-YPqjbf").getText();

        const hasTickBoxes = await browser.$$('body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied [aria-label="list item"]').length > 0;
        let checkedBody = [];
        if (hasTickBoxes) {
            const listItems = await browser.$$('body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied [aria-label="list item"]');
            const checkboxItems = await browser.$$('body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied [aria-checked]');
            let numberItems = await browser.$$('body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied [aria-label="list item"]').length;
            for (var checkedIndex = 0; checkedIndex < numberItems; checkedIndex++) {
                checkedBody.push({
                    value: await listItems[checkedIndex].getText(),
                    checked: parseBool(await checkboxItems[checkedIndex].getAttribute('aria-checked'))
                });
            }
        }
        const body = hasTickBoxes
            ? checkedBody
            : await browser.$("body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied > div.IZ65Hb-s2gQvd > div.IZ65Hb-qJTHM-haAclf > div.notranslate.IZ65Hb-YPqjbf.fmcmS-x3Eknd.h1U9Be-YPqjbf").getText();

        const keepUrl = await browser.getUrl();
        const pinnedElem = await browser.$("body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied > div.IZ65Hb-s2gQvd > div.Q0hgme-LgbsSe.Q0hgme-Bz112c-LgbsSe.IZ65Hb-nQ1Faf.VIpgJd-LgbsSe");
        const isPinned = await pinnedElem.getAttribute('data-tooltip-text') === 'Unpin note';
        const labelElems = await browser.$("body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied > div.IZ65Hb-s2gQvd > div.IZ65Hb-jfdpUb").$$('div.Q0hgme-XPtOyb.XPtOyb-di8rgd-Bz112c.notranslate label');
        const totalLabelsOnCard = labelElems.length;
        const labels = [];
        for (let labelIndex = 0; labelIndex < totalLabelsOnCard; labelIndex++) {
            console.log('get the label...');
            //const aLabel = await labelElems[labelIndex].$('div.Q0hgme-XPtOyb.XPtOyb-di8rgd-Bz112c.notranslate > div.Q0hgme-LgbsSe.XPtOyb-bN97Pc.VIpgJd-LgbsSe > label').getText();
            const aLabel = await labelElems[labelIndex].getText();
            console.log(aLabel);
            labels.push(aLabel);
        }
        const timeElem = await browser.$('body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied > div.IZ65Hb-s2gQvd > div.IZ65Hb-jfdpUb > div.IZ65Hb-jfdpUb-fmcmS');
        const createdTime = await timeElem.getAttribute('data-tooltip-text');
        const lastEditedTime = (await timeElem.getText()).replace(/\u202f/, ' ');
        const color = await browser.execute(() => {
            return window.getComputedStyle(document.querySelector("body > div.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd > div > div.IZ65Hb-TBnied"), null).backgroundColor;
        });
        console.log(keepUrl);
        console.log(title);
        console.log(body);
        console.log(labels);
        console.log(isPinned);


        await browser.execute(() => window.history.back());
        await browser.pause(500);

        const cardObj = {
            title,
            body,
            keepUrl,
            lastEditedTime,
            createdTime,
            labels,
            isPinned,
            color
        };
        cards.push(cardObj);
        console.log('Done processing item number ' + count);
    }

    console.log(cards);

    return cards;
}

function writeCardsToOutputFolder(cards, outputFolder) {
    fs.mkdirSync(`${outputFolder}`);
    const generateFilename = require('./src/filename-generator.js');
    const generators = require('./generators.js');
    const convertToMonthDateCommaYear = require('./src/card-date-parser.js');
    const updateFileTimestamps = require('filesystem-timestamp-modifier');

    cards.forEach((card) => {
        const filename = generateFilename(card.title);
        generators.forEach(({ generate, ext }) => {
            console.log(`Write ${filename}${ext}...`);
            fs.writeFileSync(`${outputFolder}/${filename}${ext}`, generate(card));
            const lastEditedDateStr = convertToMonthDateCommaYear(card.lastEditedTime.match('Edited (.*)')[1]);
            updateFileTimestamps(`${outputFolder}/${filename}${ext}`, lastEditedDateStr);
        });
    });
}


function parseBool(bool) {
    if (typeof bool !== 'string' && typeof bool !== 'boolean')
        throw new Error('bool is not of type boolean or string');
    if (typeof bool == 'boolean') return bool;
    return bool.toLowerCase() === 'true' ? true : false;
}
