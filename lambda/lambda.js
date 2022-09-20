const { DynamoDb } = require("../db/db");
const { DiscordNotification } = require("../notification/notification");
const { Scraper } = require("../scraper/scraper");
const { Browser } = require("../scraper/browser");
require("dotenv/config");

async function trackOffers(asin, price, description) {
  const browser = new Browser();
  const scraper = new Scraper();
  const dynamoDb = new DynamoDb();
  const notification = new DiscordNotification();

  const page = await browser.setupBrowser(asin);
  const offers = await scraper.getOffers(page, asin, price);
  if (offers.length > 0) {
    for (const offer of offers) {
      const offerExist = await dynamoDb.getOffer(asin, offer.price);
      if (!offerExist) {
        await notification.sendNotification(
          process.env.DISCORD_ID,
          process.env.DISCORD_TOKEN,
          asin,
          offer.price,
          description,
          offer.checkoutURL,
        );
        await dynamoDb.upsertOffer({
          asin,
          price: offer.price,
          offerId: offer.offerId,
          checkoutUrl: offer.checkoutURL,
        });
      }
    }
  }
  return null;
}

module.exports = {
  trackOffers,
};
