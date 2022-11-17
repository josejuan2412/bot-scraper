require("dotenv/config");
const fs = require("fs");
const { bufferCount, concatMap, of, delay } = require("rxjs");
const { DynamoDb } = require("./db/db.js");
const {
  TrackOffersScheduler,
} = require("./scheduler/third-party-scheduler.js");
const {
  DELAY_BETWEEN_GROUPS,
  FETCH_FREQUENCY,
  WORKER_GROUP_LENGTH,
} = require("./constants");
// Control Variables
let fetchFromCache = false;

const db = new DynamoDb();
// This is for test purposes
let getData = async () => {
  const arr = [];
  for (let i = 0; i < 1; i++) {
    arr.push({
      asin: "B0BCQ3C4T2",
      description:
        "Govee Permanent Outdoor Lights, Smart RGBIC Outdoor Lights with 72 Scene Modes, 100ft with 72 LED Eaves Lights IP67 Waterproof for Party, Game Day, Daily Lighting, Work with Alexa, Google Assistant",
      createdAt: "2022-09-26T00:00:00.000Z",
      price: 350,
      tier: 3,
    });
  }
  return arr;
};

/*getData = async () => {
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
};*/

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
    const trackOffersScheduler = new TrackOffersScheduler({
      getData,
      fetchFrequency: FETCH_FREQUENCY,
    });

    let observable;
    try {
      observable = await trackOffersScheduler.execute();
    } catch (e) {
      if (trackOffersScheduler.browser) {
        await trackOffersScheduler.browser.close();
      }
      reject(e);
    }

    observable
      .pipe(
        bufferCount(WORKER_GROUP_LENGTH),
        concatMap((x) => of(x).pipe(delay(DELAY_BETWEEN_GROUPS))),
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
          if (trackOffersScheduler.browser) {
            await trackOffersScheduler.browser.close();
          }
          reject(err);
        },
        complete: () => {
          resolve(trackOffersScheduler.browser);
        },
      });
  });
}
