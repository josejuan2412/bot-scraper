const puppeteer = require("puppeteer");

class Browser {
  async setupBrowser(product) {
    const url = `https://smile.amazon.com/dp/${product}?aod=1`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
  }
}

module.exports = {
  Browser,
};
