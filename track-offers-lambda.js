// Este es el entry point del lambda que trackea un solo asin
const { Browser } = require('./scraper/browser');
const { trackOffers } = require('./lambda/track-offers');
const MAX_COUNT = 30;

exports.handler = async (event) => {
	const response = {
		statusCode: 200,
		body: null,
	};
	try {
		response.body = await run(event);
	} catch (e) {
		response.statusCode = 500;
		response.body = {
			success: false,
			error: e.message,
		};
	}

	return response;
};

async function run({ asin, price, description }) {
	return new Promise(async (resolve, reject) => {
		console.log(`SETUP BROWSER`);
		const browser = await Browser.build();
		console.log(`SUCCESS SETTING UP BROWSER`);
		const seconds = 15;
		let count = 0;
		const interval = setInterval(async () => {
			if (count === MAX_COUNT) {
				console.log(
					`COMPLETE MAX COUNT (${MAX_COUNT}) for asin "${asin}"`
				);
				clearInterval(interval);
				resolve({ success: true });
				return;
			}
			try {
				console.log(
					`Intent #${count + 1} tracking asin "${asin}". TS: `,
					new Date()
				);
				await trackOffers({ browser, asin, price, description });
				console.log(
					`Success #${count + 1} tracking "${asin}". TS: `,
					new Date()
				);
			} catch (e) {
				console.log(
					`Error #${count + 1} tracking "${asin}". TS: `,
					new Date(),
					'\n',
					e.message
				);
			}
			count += 1;
		}, seconds * 1000);
	});
}
