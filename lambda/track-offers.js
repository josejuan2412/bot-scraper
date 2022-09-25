const { DynamoDb } = require("../db/db");
const { Scraper } = require("../scraper/scraper");
const { Browser } = require("../scraper/browser");
require("dotenv/config");

async function trackOffers(asin, price, description) {
  const browser = new Browser();
  const scraper = new Scraper();
  const dynamoDb = new DynamoDb();
  const page = await browser.setupBrowser(asin);
  const offers = await scraper.getOffers(page, asin, price);
  console.log(`Total of offers: ${offers.length}`);
  if (offers.length > 0) {
    for (const offer of offers) {
      const offerExist = await dynamoDb.getOffer(asin, offer.price);
      if (!offerExist) {
        console.log(`The offer do not exist and i should send a notification`, {
          asin,
          price,
          description
        })
        await dynamoDb.upsertOffer({
          asin,
          price: offer.price,
          offerId: offer.offerID,
          checkoutUrl: offer.checkoutUrl,
        });
      } else {
        console.log(`The offer exist`)
      }
    }
  }
  return null;
}

module.exports = {
  trackOffers,
};
