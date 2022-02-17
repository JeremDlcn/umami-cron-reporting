const ImagesToPDF = require('images-pdf');
const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();


//Check if the folder "files" exist
if (!fs.existsSync('files')) fs.mkdirSync(`files`);

(async () => {
    const browser = await puppeteer.launch({headless: false, ignoreHTTPSErrors: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1060,height: 745});
    await page.goto(process.env.URL);
    // Login
    await page.type('input[name=username]', process.env.USER);
    await page.type('input[name=password]', process.env.PASSWORD);
    await page.click('button[type=submit]');
    //List of all website
    await page.waitForNavigation();
    await page.waitForSelector('a[href*="settings"]')
    await page.click('a[href*="settings"]')
    // Capture all websites
    await page.waitForNavigation();
    await page.waitForSelector('div.Table_body__1_740')
    const data = await page.evaluate(() => {
        let final = [];
        document.querySelectorAll('div.Table_body__1_740 .row a').forEach(elt => {final.push({name: elt.textContent ,url:elt.href})})
        return final
    })
    for (const [i, site] of data.entries()) {
        await page.goto(site.url);
        await page.waitForSelector('.rsm-geographies')
        await page.waitForTimeout(1000)
        if (!fs.existsSync(`files/${site.name}`)) fs.mkdirSync(`files/${site.name}`);
        await page.screenshot({ path: `files/${site.name}/umami-export.png`, fullPage: true })
        new ImagesToPDF.ImagesToPDF().convertFolderToPDF(`files/${site.name}`, `files/Reporting-${site.name}.pdf`);
    }

    await browser.close();
})();
