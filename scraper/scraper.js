const cheerio = require("cheerio");

class Scraper {
  async getOffers(page, product, priceTarget) {
    // page.reload(); //verify if there's a way to prevent this
    let html = await page.evaluate(() => document.body.innerHTML);
    console.log(`I RECEIVE THE HTML`);
    const $ = cheerio.load(html);
    let offerList = [];
    $("#aod-offer-list", html).each((id, item) => {
      const list = $(item);
      const offer = list.find("#aod-offer");
      console.log(`THIS IS THE OFFER`);
      console.log(offer);
      offer.each((index, row) => {
        let seller = $(row).find("#aod-offer-soldBy");
        const provider = $(seller)
          .find("div.a-fixed-left-grid-col.a-col-right")
          .text();
        if (provider.trim() === "Amazon Warehouse") {
          let buttonDiv = $(row).find(
            "div.a-fixed-right-grid-col.aod-atc-column.a-col-right",
          );
          let offerElement = $(buttonDiv).find("span.a-declarative");
          const offerAttribute = offerElement[0].attribs["data-aod-atc-action"];
          const offerPrice = parseFloat(
            $(row)
              .find("span.a-offscreen")
              .text()
              .substring(1)
              .replace(",", ""),
          );
          const offerID = JSON.parse(offerAttribute).oid;
          if (offerPrice < priceTarget)
            offerList.push({
              price: offerPrice,
              seller: "Amazon Warehouse",
              offerID: offerID,
              ASIN: product,
              checkoutUrl: `https://smile.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=${offerID}&quantity=1`,
            });
        }
      });
    });
    console.log(`Offerlist`, offerList);
    return offerList;
  }

  async discoverOffers(page, product) {
    let html = await page.evaluate(() => document.body.innerHTML);
    console.log(`I RECEIVE THE HTML`);
    const $ = cheerio.load(html);
    let offerList = [];
    $("#aod-offer-list", html).each((id, item) => {
      const list = $(item);
      const offer = list.find("#aod-offer");
      offer.each((index, row) => {
        let seller = $(row).find("#aod-offer-soldBy");
        const provider = $(seller)
          .find("div.a-fixed-left-grid-col.a-col-right")
          .text();
        if (provider.trim() === "Amazon Warehouse") {
          let buttonDiv = $(row).find(
            "div.a-fixed-right-grid-col.aod-atc-column.a-col-right",
          );
          let offerElement = $(buttonDiv).find("span.a-declarative");
          const offerAttribute = offerElement[0].attribs["data-aod-atc-action"];
          const offerPrice = parseFloat(
            $(row)
              .find("span.a-offscreen")
              .text()
              .substring(1)
              .replace(",", ""),
          );
          const offerID = JSON.parse(offerAttribute).oid;
          offerList.push({
            price: offerPrice,
            seller: "Amazon Warehouse",
            offerID: offerID,
            ASIN: product,
            checkoutUrl: `https://smile.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=${offerID}&quantity=1`,
          });
        }
      });
    });
    console.log(`Offerlist`, offerList);
    return offerList;
  }

  async getAsins(page) {
    let html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
    let asins = [];
    $(
      "div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20",
    ).each((_idx, el) => {
      const asin = el.attribs["data-asin"];
      const product = $(el);
      const title = product
        .find("span.a-size-base-plus.a-color-base.a-text-normal")
        .text();
      let element = {
        title,
        asin,
      };
      asins.push(element);
    });
    return asins;
  }
}

module.exports = {
  Scraper,
};
