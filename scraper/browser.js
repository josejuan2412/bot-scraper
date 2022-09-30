const chromium = require("chrome-aws-lambda");
require("dotenv/config");

class Browser {
  constructor(browser) {
    this.browser = browser;
  }
  async getPage(product) {
    const url = `https://smile.amazon.com/dp/${product}?aod=1`;
    let page = await this.browser.newPage();

    console.log(`AFTER PAGE`);
    await page.goto(url, { waitUntil: "load" });
    console.log(`AFTER PAGE GOTO`);
    return page;
  }

  static async build() {
    return await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: "/opt/homebrew/bin/chromium", //await chromium.executablePath,
      headless: chromium.headless,
    });
  }
}

module.exports = {
  Browser,
};
