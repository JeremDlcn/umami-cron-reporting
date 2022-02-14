const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 640,
        height: 480
    })
    await page.goto(process.env.URL);


    // Login
    await page.type('input[name=username]', process.env.USER);
    await page.type('input[name=password]', process.env.PASSWORD);
    await page.click('button[type=submit]');
    await page.waitForNavigation();


    await page.pdf({ path: 'umami-export.pdf', format: 'a4' });
    await browser.close();
})();