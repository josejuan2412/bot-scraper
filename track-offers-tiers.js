require("dotenv/config");
const fs = require("fs");
const { bufferCount, concatMap, of, delay, filter } = require("rxjs");
const { DynamoDb } = require("./db/db.js");
const { BrowserClient } = require("./scraper/browser-client");
const {
  TrackOffersScheduler,
} = require("./scheduler/track-offer-scheduler.js");
const { TIERS_VALUES } = require("./constants");
// Control Variables
let fetchFromCache = false;

const db = new DynamoDb();
// This is for test purposes
let getData = async () => {
  const arr = [];
  for (let i = 0; i < 20; i++) {
    arr.push({
      asin: "B09N3RF", //"B07PXGQC1Q",
      description:
        "Apple AirPods (2nd Generation) Wireless Earbuds with Lightning Charging Case Included. Over 24 Hours of Battery Life, Effortless Setup. Bluetooth Headphones for iPhone",
      createdAt: "2022-09-26T00:00:00.000Z",
      price: 35,
      tier: 1,
    });
  }
  return arr;
};

getData = async () => {
  if (!fetchFromCache) {
    const products = await db.getProducts();
    fs.writeFileSync(
      "products.json",
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    fetchFromCache = true;
    return products;
  }

  return JSON.parse(fs.readFileSync("products.json", "utf-8"));
};

run()
  .then((browser) => {
    console.log(`FINISH PROCESISNG`);
    return browser.close();
  })
  .then(() => {
    console.log(`Finish closing the browser`);
  })
  .catch(console.error);

async function run() {
  return new Promise(async (resolve, reject) => {
    let browser = null;
    // CONTAINS ALL THE OBSERVABLE
    let observables = {};

    try {
      browser = await BrowserClient.build();
    } catch (err) {
      reject(err);
      return;
    }

    const tiers = ["high", "medium", "low"];
    try {
      for (const tier of tiers) {
        const scheduler = new TrackOffersScheduler({
          getData,
          fetchFrequency: TIERS_VALUES[tier].fetchFrequency * 1000,
          tier: getTierNumber(tier),
        });
        scheduler.browser = browser;
        observables[tier] = await scheduler.execute();
        console.log(`Adding observable for tier: "${tier}"`);
        processObservables(observables, tier, browser, resolve, reject);
      }
    } catch (e) {
      await browser.close();
      reject(e);
      return;
    }
  });
}

function processObservables(observables, tier, browser, resolve, reject) {
  const tierNumber = getTierNumber(tier);
  const observable = observables[tier];

  const values = TIERS_VALUES[tier];

  observable
    .pipe(filter((worker) => worker.product.tier === tierNumber))
    .pipe(
      bufferCount(values.group),
      concatMap((x) => of(x).pipe(getRandomDelay(tier)))
    )
    .subscribe({
      next: (workers) => {
        Promise.all(workers.map((w) => w.execute()))
          .then(() => {
            console.log(`Success processing group`);
          })
          .catch(console.error);
      },
      error: async (err) => {
        await browser;
        reject(err);
      },
      complete: () => {
        resolve(browser);
      },
    });
}

function getRandomDelay(tier) {
  const tierDelay = generateRandomFromRange(
    TIERS_VALUES[tier].delay.min,
    TIERS_VALUES[tier].delay.max
  );
  console.log(`Delay of ${tierDelay}s in tier "${tier}"`);
  return delay(tierDelay * 1000);
}

function generateRandomFromRange(min, max) {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}

function getTierNumber(tier) {
  switch (tier) {
    case "high":
      return 1;
    case "medium":
      return 2;
    default:
      return 3;
  }
}
