const cheerio = require("cheerio");
class ValidationError extends Error {
  constructor(type) {
    super(type);
    this.name = "ValidationError";
  }
}

class Scraper {
  static getOffers({ html, asin }) {
    // page.reload(); //verify if there's a way to prevent this
    // let html = await page.evaluate(() => document.body.innerHTML);
    console.log(html);
    const $ = cheerio.load(html);
    let offers = [];
    const errors = [
      {
        message: `Sorry! We couldn't find that page. Try searching or go to Amazon's home page.`,
        type: "Not Found",
      },
      {
        message: `Sorry, we just need to make sure you're not a robot. For best results, please make sure your browser is accepting cookies.`,
        type: "Captcha",
      },
      {
        message: `Something went wrong on our end`,
        type: "Amazon server error",
      },
    ];
    for (const error in errors) {
      if (html.includes(error.message)) {
        throw new ValidationError(error);
      }
    }

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
          offers.push({
            price: offerPrice,
            seller: "Amazon Warehouse",
            offerID: offerID,
            ASIN: asin,
            checkoutUrl: `https://smile.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=${offerID}&quantity=1`,
          });
        }
      });
    });
    return offers;
  }

  async discoverOffers({ html, asin }) {
    // let html = await page.evaluate(() => document.body.innerHTML);
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
            ASIN: asin,
            checkoutUrl: `https://smile.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=${offerID}&quantity=1`,
          });
        }
      });
    });
    console.log(`Offerlist`, offerList);
    return offerList;
  }

  async getAsins(html) {
    // let html = await page.evaluate(() => document.body.innerHTML);
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
