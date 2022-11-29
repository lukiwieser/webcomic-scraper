const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * Todos:
 * - await when saving the file 
 */ 

(async () => {
    const config = {
        pageUrl: 'https://www.smackjeeves.com/discover/detail?titleNo=102703&articleNo=',
        pageNumerStart: 211,
        pageNumberEnd: 799,
        downloadFolder: 'downloads',
        filenameMode: 3,                // 1: pagenumber, 2: HTML-Name, 3: pagenumber & HTML-Name
        filenameLeadingZeroCount: 3,    // used in mode 1 and 3
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await disableFontLoading(page);

    for(let i = config.pageNumerStart; i <= config.pageNumberEnd; i++) {
        await downloadPage(page, i, config);
    }

    await browser.close();
})();


async function downloadPage(page, pageNumber, config) {
    console.log(`Downloading page ${pageNumber} ...`);

    const pageUrl = config.pageUrl + pageNumber;
    await page.goto(pageUrl);

    const chapterSelector = '.header02__chapter-name';
    let chapter = await page.evaluate((sel) => {
        return document.querySelector(sel).innerText;
    }, chapterSelector);
    chapter = replaceEvilChars(chapter);

    const imageSelector = '.comic-image__image';
    let imageUrl = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('src');
    }, imageSelector);

    let newFileName;
    switch(config.filenameMode) {
        case 1: newFileName = pageNumber.toString().padStart(config.filenameLeadingZeroCount, '0'); break;
        case 2: newFileName = chapter; break;
        case 3: newFileName = pageNumber.toString().padStart(config.filenameLeadingZeroCount, '0') + ' ' + chapter; break;
    }
    const filePath = config.downloadFolder + '/' + newFileName;

    let viewSource = await page.goto(imageUrl);
    fs.writeFile(filePath + '.png', await viewSource.buffer(), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`The file for page ${pageNumber} was saved!`);
    });
}


async function disableFontLoading(page) {
    await page.setRequestInterception(true);
    
    page.on('request', (req) => {
        if (req.resourceType() == 'font') {
            req.abort();
        } else {
            req.continue();
        }
    });
}


function replaceEvilChars(text) {
    const replaceRules = new Map([
        ['<', ' '],
        ['>', ' '],
        [':', ''],
        ['"', ' '],
        ['/', ' '],
        ['\\', ' '],
        ['|', ' '],
        ['?', ' '],
        ['*', ' '],
    ]);

    for(let [key, value] of replaceRules.entries()) {
        text = text.split(key).join(value);
    }

    return text;
}