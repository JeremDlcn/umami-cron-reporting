const puppeteer = require('puppeteer');
require('dotenv').config();
const ImagesToPDF = require('images-pdf');



(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.setViewport({
        width:1060,
        height:745
      })
    await page.goto(process.env.URL);


    // Login
    await page.type('input[name=username]', process.env.USER);
    await page.type('input[name=password]', process.env.PASSWORD);
    await page.click('button[type=submit]');
    await page.waitForNavigation({waitUntil: 'networkidle2'});

    // Take page reporting
    await page.screenshot({ path: 'images/umami-export.png', fullPage: true})
    new ImagesToPDF.ImagesToPDF().convertFolderToPDF('images', 'output/umami.pdf');



    await browser.close();
})();