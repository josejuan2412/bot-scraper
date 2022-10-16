const { DynamoDb } = require('../db/db');
const { Scraper } = require('../scraper/scraper');
const { BrowserClient } = require('../scraper/browser-client');
// const { discordNotification } = require("../notifications/discord");
require('dotenv/config');

async function trackOffers({ browser, asin, price, description }) {
	const newBrowser = new BrowserClient(browser);
	const dynamoDb = new DynamoDb();
	const html = await newBrowser.getPageHTML(asin);
	const offers = Scraper.getOffers({ html, asin, price });
	console.log(`Total of offers: ${offers.length}`);
	if (offers.length > 0) {
		for (const offer of offers) {
			const offerExist = await dynamoDb.getOffer(asin, offer.price);
			if (!offerExist) {
				/*await discordNotification(
          process.env.DISCORD_ID,
          process.env.DISCORD_TOKEN,
          asin,
          offer.price,
          description,
          offer.checkoutUrl,
        );*/
				await dynamoDb.upsertOffer({
					asin,
					price: offer.price,
					offerId: offer.offerID,
					checkoutUrl: offer.checkoutUrl,
				});
			} else {
				console.log(`The offer exist`);
			}
		}
	}
	return null;
}

module.exports = {
	trackOffers,
};
