const chromium = require("chrome-aws-lambda");

class Browser {
  async setupBrowser(product) {
    const url = `https://smile.amazon.com/dp/${product}?aod=1`;
    console.log(`BEFORE OPENING THE BROWSER`, url);
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    console.log(`AFTER BROWSER`);

    let page = await browser.newPage();
    console.log(`AFTER PAGE`);
    await page.goto(url);
    console.log(`AFTER PAGE GOTO`)
    return page;
  }
}

module.exports = {
  Browser,
};
