require('dotenv/config');
const { bufferCount, concatMap, of, delay, filter } = require('rxjs');
const { DynamoDb } = require('./db/db.js');
const {
	TrackOffersScheduler,
} = require('./scheduler/track-offer-scheduler.js');
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
	return await db.getProducts();
};

run()
	.then(() => {
		console.log(`FINISH PROCESISNG`);
	})
	.catch(console.error);

async function run() {
	return new Promise(async (resolve, reject) => {
		const trackOffersScheduler = new TrackOffersScheduler({
			getData,
		});

		let observable;
		try {
			observable = await trackOffersScheduler.execute();
		} catch (e) {
			reject(e);
		}

		observable
			.pipe(
				bufferCount(5),
				concatMap((x) => of(x).pipe(delay(1000)))
			)
			.subscribe({
				next: (workers) => {
					console.log(`Workers`, workers);
					Promise.all(workers.map((w) => w.execute()))
						.then(() => {
							console.log(`Success processing group`);
						})
						.catch(console.error);
				},
				error: reject,
				complete: resolve,
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
