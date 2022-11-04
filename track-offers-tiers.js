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

runWithTiers()
  .then((browser) => {
    console.log(`FINISH PROCESISNG`);
    return browser.close();
  })
  .then(() => {
    console.log(`Finish closing the browser`);
  })
  .catch(console.error);

async function runWithTiers() {
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

    const highTrackOffersScheduler = new TrackOffersScheduler({
      getData,
      fetchFrequency: TIERS_VALUES["high"].fetchFrequency * 1000,
      tier: 1,
    });

    const mediumTrackOffersScheduler = new TrackOffersScheduler({
      getData,
      fetchFrequency: TIERS_VALUES["medium"].fetchFrequency * 1000,
      tier: 2,
    });

    const lowTrackOffersScheduler = new TrackOffersScheduler({
      getData,
      fetchFrequency: TIERS_VALUES["low"].fetchFrequency * 1000,
      tier: 3,
    });

    try {
      highTrackOffersScheduler.browser = browser;
      mediumTrackOffersScheduler.browser = browser;
      lowTrackOffersScheduler.browser = browser;
      observables["high"] = await highTrackOffersScheduler.execute();
      observables["medium"] = await mediumTrackOffersScheduler.execute();
      observables["low"] = await lowTrackOffersScheduler.execute();
    } catch (e) {
      await browser.close();
      reject(e);
      return;
    }

    const tiers = ["low", "high", "medium"];
    for (const tier of tiers) {
      console.log(`Adding observable for tier: "${tier}"`);
      processObservables(observables, tier, browser, resolve, reject);
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

function generateRandomFromRange(min = 0, max = 100) {
  // find diff
  let difference = max - min;

  // generate random number
  let rand = Math.random();

  // multiply with difference
  rand = Math.floor(rand * difference);

  // add with min value
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

/*observable
	.pipe(filter((ev) => ev % 2 === 0))
	.pipe(
		bufferCount(10),
		concatMap((x) => of(x).pipe(delay(100)))
	)
	.subscribe((products) => {
		console.log(`Par number`);
		console.log(products);
		console.log(`----------------`);
	});

observable
	.pipe(filter((ev) => ev % 2 !== 0))
	.pipe(
		bufferCount(5),
		concatMap((x) => of(x).pipe(delay(500)))
	)
	.subscribe((products) => {
		console.log(`Odd numbers`);
		console.log(products);
		console.log(`----------------`);
	});*/
