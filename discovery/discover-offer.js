const { DynamoDb } = require("../db/db");
const { Scraper } = require("../scraper/scraper");
const { BrowserClient } = require("../scraper/browser-client");
const { discordNotification } = require("../notifications/discord");
require("dotenv/config");

async function Discover(browser, asin, description) {
  const newBrowser = new Browser(browser);
  const scraper = new Scraper();
  const dynamoDb = new DynamoDb();
  const page = await newBrowser.getPage(asin);
  const offers = await scraper.discoverOffers(page, asin);
  if (page) {
    page.close();
  }
  if (offers.length > 0) {
    console.log(`Total of offers: ${offers.length}`);
    for (const offer of offers) {
      const offerExist = false; //await dynamoDb.getDiscoveryOffer(asin, offer.price);
      if (!offerExist) {
        console.log("send notification: ", offer);
        // await discordNotification(
        //   process.env.DISCORD_ID,
        //   process.env.DISCORD_TOKEN,
        //   asin,
        //   offer.price,
        //   description,
        //   offer.checkoutUrl,
        // );
        // await dynamoDb.upsertDiscoveryOffer({
        //   asin,
        //   price: offer.price,
        //   offerId: offer.offerID,
        //   checkoutUrl: offer.checkoutUrl,
        // });
      } else {
        console.log(`The offer exist`);
      }
    }
  }
  return null;
}

module.exports = {
  Discover,
};
