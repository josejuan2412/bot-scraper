const { Observable } = require('rxjs');
const { DynamoDb } = require('../db/db');
const { Discord } = require('../notifications/discord');
const { BrowserClient } = require('../scraper/browser-client');
const { Scraper } = require('../scraper/scraper');

const INTERVAL = 10000;
class TrackOffersScheduler {
	constructor({ getData }) {
		this.getData = getData;
	}

	async execute() {
		this.browser = await BrowserClient.build();
		const db = new DynamoDb();
		const discord = new Discord();
		return new Observable((subscriber) => {
			setInterval(async () => {
				try {
					for (const product of await this.getData()) {
						console.log(`Product`, product);
						const worker = new TrackOffersWorker({
							product,
							browser: this.browser,
							db,
							discord,
						});
						subscriber.next(worker);
					}
				} catch (e) {
					console.error(e);
				}
			}, INTERVAL);
		});
	}
}

class TrackOffersWorker {
	constructor({ product, browser, db, discord }) {
		this.browserClient = new BrowserClient(browser);
		this.product = product;
		this.db = db;
		this.discord = discord;
	}

	async execute() {
		const { asin, price } = this.product;
		const html = await this.browserClient.getPageHTML(asin);
		const offers = Scraper.getOffers({
			html,
			asin,
			priceTarget: price,
		});
		for (const offer of offers) {
			const offerExist = await this.db.getOffer(asin, offer.price);
			if (!offerExist) {
				console.log(
					`The offer for "${asin}" didn't exist so i will create it`
				);
				this.notify(offer);
				await this.updateOffer(offer);
			} else {
				console.log(`The offer for "${asin}" already exist`);
			}
		}
		return offers;
	}

	notify(offer) {
		const { asin, description } = this.product;
		const { price, checkoutUrl } = offer;
		this.discord.notifyOffer({
			asin,
			price,
			title: description,
			checkoutUrl,
		});
	}

	async updateOffer(offer) {
		await db.upsertOffer({
			asin: this.product.asin,
			price: offer.price,
			offerId: offer.offerID,
			checkoutUrl: offer.checkoutUrl,
		});
	}
}

module.exports = {
	TrackOffersScheduler,
	TrackOffersWorker,
};
