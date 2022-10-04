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
    await page.goto(url, {
      waitUntil: ["load", "networkidle0", "networkidle2"],
      timeout: 0,
    });
    console.log(`AFTER PAGE GOTO`);
    return page;
  }

  static async build() {
    const executablePath =
      process.env.NODE_ENV === "local"
        ? process.env.CHROMIUM_PATH
        : await chromium.executablePath;
    let args = [
      ...chromium.args,
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-gpu",
      "--disable-software-rasterize",
    ];
    return await chromium.puppeteer.launch({
      args: args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
  }
}

module.exports = {
  Browser,
};
