const chromium = require("chrome-aws-lambda");

class Browser {
  async setupBrowser(product) {
    const url = `https://smile.amazon.com/dp/${product}?aod=1`;
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    await page.goto(url);
    return page;
  }
}

module.exports = {
  Browser,
};
