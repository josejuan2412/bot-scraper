const { bufferCount } = require('rxjs');
const { DynamoDb } = require('../db/db');
const { Discord } = require('../notifications/discord');
const { BrowserClient } = require('../scraper/browser-client');
const {
	TrackOffersScheduler,
	TrackOffersWorker,
} = require('./track-offer-scheduler');
async function getData() {
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
}

describe.only('TrackOffersWorker', () => {
	let browser;
	let db;
	let discord;
	beforeAll(async () => {
		browser = await BrowserClient.build();
		db = new DynamoDb();
		discord = new Discord();
	});
	test('Should product offer', async () => {
		const products = await getData();
		const product = products[0];
		const worker = new TrackOffersWorker({
			product,
			browser,
			db,
			discord,
		});
		const offers = await worker.execute();
		expect(offers).not.toBe(null);
	});
	afterAll(async () => {
		if (browser) {
			await browser.close();
		}
	});
});

describe.skip('TrackOffersScheduler', () => {
	test(
		'Should process items',
		(done) => {
			const trackOffersScheduler = new TrackOffersScheduler({
				getData,
			});
			const observable = trackOffersScheduler.execute();
			setTimeout(() => {
				done();
			}, 20 * 1000);
			console.log(`Products`);
			observable.pipe(bufferCount(5)).subscribe((products) => {
				console.log(products);
			});
		},
		5 * 30 * 1000
	);
});
