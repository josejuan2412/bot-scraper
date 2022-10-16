const puppeteer = require('puppeteer');
class BrowserClient {
	constructor(browser) {
		this.browser = browser;
	}
	async getPage(product) {
		const url = `https://smile.amazon.com/dp/${product}?aod=1`;
		let page = await this.browser.newPage();
		await page.goto(url, {
			waitUntil: ['load', 'networkidle0', 'networkidle2'],
			timeout: 0,
		});
		return page;
	}

	async getPageHTML(asin) {
		const url = `https://smile.amazon.com/dp/${asin}?aod=1`;
		let page = await this.browser.newPage();
		await page.goto(url, {
			waitUntil: ['load', 'networkidle0', 'networkidle2'],
			timeout: 0,
		});
		let html = await page.evaluate(() => document.body.innerHTML);
		await page.close();
		return html;
	}

	async loadPage(url) {
		let page = await this.browser.newPage();
		await page.goto(url, {
			waitUntil: ['load', 'networkidle0', 'networkidle2'],
			timeout: 0,
		});
		return page;
	}

	static async build() {
		let args = [
			/// ...chromium.args,
			'--disable-features=AudioServiceOutOfProcess',
			'--disable-gpu',
			'--disable-software-rasterize',
		];
		return await puppeteer.launch({
			args: args,
			executablePath: process.env.CHROMIUM_PATH,
			headless: false,
		});
	}
}

module.exports = {
	BrowserClient,
};
