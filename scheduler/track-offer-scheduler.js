const { Observable } = require("rxjs");
const { DynamoDb } = require("../db/db");
const { Discord } = require("../notifications/discord");
const { BrowserClient } = require("../scraper/browser-client");
const { Scraper } = require("../scraper/scraper");

const INTERVAL = 10 * 000;
class TrackOffersScheduler {
  browser = null;
  db = null;
  discord = null;
  browser = null;
  constructor({ getData, fetchFrequency, tier }) {
    this.getData = getData;
    this.fetchFrequency = fetchFrequency || INTERVAL;
    if (tier) {
      this.tier = tier;
    }
  }

  async execute() {
    if (!this.browser) {
      this.browser = await BrowserClient.build();
    }
    this.db = new DynamoDb();
    this.discord = new Discord();
    return new Observable(async (subscriber) => {
      await this.run(subscriber);
      setInterval(async () => {
        await this.run(subscriber);
      }, this.fetchFrequency);
    });
  }

  async run(subscriber) {
    try {
      let products = await this.getData();
      if (this.tier) {
        products = products.filter((p) => p.tier === this.tier);
      }
      console.log(` ${products.length} products`);
      for (const product of products) {
        const worker = new TrackOffersWorker({
          product,
          browser: this.browser,
          db: this.db,
          discord: this.discord,
        });
        subscriber.next(worker);
      }
    } catch (e) {
      console.error(e);
    }
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
    const { asin, price, description, tier } = this.product;
    // Await randomness timeout in the request
    console.log(`Processing (${asin}): "${description}" with tier: ${tier}`);
    await this.addDelay();
    const html = await this.browserClient.getPageHTML(asin);
    let offers = Scraper.getOffers({
      html,
      asin,
    });

    if (!offers.length) {
      console.log(`Offers not found for "${asin}"`);
    } else {
      console.log(
        `For "${description}" (${asin}) i found ${offers.length} offers`
      );
    }

    offers = offers.filter((offer) => offer.price < price);
    for (const offer of offers) {
      const offerExist = await this.db.getOffer(asin, offer.price);
      if (!offerExist) {
        console.log(`The offer for "${asin}" didn't exist so i will create it`);
        this.notify(offer);
        await this.updateOffer(offer);
      } else {
        console.log(`The offer for "${asin}" already exist`);
      }
    }
    return offers;
  }

  async addDelay() {
    const minSeconds = 0;
    const maxSeconds = 10;
    await this.timeout(randomNumber(minSeconds, maxSeconds));
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

  async timeout(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = {
  TrackOffersScheduler,
  TrackOffersWorker,
};
