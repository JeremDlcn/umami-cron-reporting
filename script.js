const puppeteer = require('puppeteer');
require('dotenv').config();
const ImagesToPDF = require('images-pdf');
import { createPDF, splitPDF } from "pdf-actions";
import JSZip from "jszip";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1060,
        height: 745
    })
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
        document.querySelectorAll('div.Table_body__1_740 .row a').forEach(elt => {
            final.push(elt.href)
        })
        return final
    })
    for (const [i, url] of data.entries()) {
        await page.goto(url);
        await page.waitForSelector('.rsm-geographies')
        await page.waitForTimeout(1000)
        await page.screenshot({ path: `images/umami-export${i}.png`, fullPage: true })
        console.log(`Screenshots taken ✨`);
    }
    new ImagesToPDF.ImagesToPDF().convertFolderToPDF('images', `output/umami.pdf`);

    const splitPDFHandler = async (files) => {
        const zip = new JSZip();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const pdfFile = await createPDF.PDFDocumentFromFile(file);
            const splitPDF = await splitPDF(pdfFile, file.range, {degree: file.degrees})
            const pdfFile = await splitPDF.save();
                zip.file(`split-${file.name}`, pdfFile);
        }
        await zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "splitPDFFiles.zip");
        });
    };

    await browser.close();
})();
