const { BrowserClient } = require("../scraper/browser-client");
const { Scraper } = require("../scraper/scraper");

class Discovery {
  async fetchProducts(url, browser, keywords) {
    const newBrowser = new Browser(browser);
    const scraper = new Scraper();
    const page = await newBrowser.loadPage(url);
    const asins = await scraper.getAsins(page);
    console.log(asins);
    let filtered = [];
    for (const asin of asins) {
      if (keywords.some((keyword) => asin.title.includes(keyword))) {
        console.log("Found match: ", asin);
        //is it blacklisted? yes=skip : no=push
        filtered.push(asin);
      }
    }
    //discover-offers all found products (invoke lambda)
    return filtered;
  }
}

module.exports = {
  Discovery,
};
