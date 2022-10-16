require('dotenv/config');
const fs = require('fs');
const { bufferCount, concatMap, of, delay, filter } = require('rxjs');
const { DynamoDb } = require('./db/db.js');
const {
	TrackOffersScheduler,
} = require('./scheduler/track-offer-scheduler.js');
// Control Variables
const DELAY_BETWEEN_GROUPS = 10 * 1000; // 10 Seconds
const FETCH_FREQUENCY = 120 * 1000; // Fetch the products every minute
const WORKER_GROUP_LENGTH = 5;
let fetchFromCache = true;

const db = new DynamoDb();
// This is for test purposes
let getData = async () => {
	const arr = [];
	for (let i = 0; i < 20; i++) {
		arr.push({
			asin: 'B07822Z77M',
			description:
				'Samsung SSD 860 EVO 1TB M.2 SATA Internal SSD (MZ-N6E1T0BW)',
			createdAt: '2022-09-26T00:00:00.000Z',
			price: 25,
		});
	}
	return arr;
};

getData = async () => {
	if (!fetchFromCache) {
		const products = await db.getProducts();
		fs.writeFileSync(
			'products.json',
			JSON.stringify(products, null, 2),
			'utf-8'
		);
		fetchFromCache = true;
		return products;
	}

	return JSON.parse(fs.readFileSync('products.json', 'utf-8'));
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
				concatMap((x) => of(x).pipe(delay(DELAY_BETWEEN_GROUPS)))
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
