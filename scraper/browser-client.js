const puppeteer = require("puppeteer");
const HEADLESS = false;
const DIMENSIONS = {
  width: 1440,
  height: 700,
};
class BrowserClient {
  constructor(browser) {
    this.browser = browser;
  }
  async getPage(product) {
    const url = `https://smile.amazon.com/dp/${product}?aod=1`;
    let page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: ["domcontentloaded"],
      // timeout: 0,
    });
    return page;
  }

  async getPageHTML(asin) {
    try {
      const url = `https://smile.amazon.com/dp/${asin}?aod=1`;
      let page = await this.browser.newPage();
      await page.setViewport({
        width: DIMENSIONS.width,
        height: DIMENSIONS.height,
        deviceScaleFactor: 1,
      });
      // Method 1
      await page.goto(url, {
        waitUntil: ["networkidle2"],
        timeout: 0,
      });
      // Method 2
      // page.goto(url);
      // await page.waitForSelector('#aod-offer-list');
      let html = await page.evaluate(() => document.body.innerHTML);
      await page.close();
      return html;
    } catch (e) {
      console.error(e);
    }
  }

  async loadPage(url) {
    let page = await this.browser.newPage();
    await page.goto(url, {
      waitUntil: ["load", "networkidle0", "networkidle2"],
      timeout: 0,
    });
    return page;
  }

  static async build() {
    let args = [
      /// ...chromium.args,
      // '--disable-features=AudioServiceOutOfProcess',
      // '--no-sandbox',
      // `--window-size=${DIMENSIONS.width},${DIMENSIONS.height}`,
    ];
    return await puppeteer.launch({
      args: args,
      executablePath: process.env.CHROMIUM_PATH,
      headless: HEADLESS,
    });
  }
}

module.exports = {
  BrowserClient,
};
