run()
	.then((browser) => {
		console.log(`FINISH PROCESISNG`);
		return browser.close();
	})
	.then(() => {
		console.log(`Finish closing the browser`);
	})
	.catch(console.error);
async function getData() {
	const products = await db.getProducts();
	fs.writeFileSync(
		'products.json',
		JSON.stringify(products, null, 2),
		'utf-8'
	);
	fetchFromCache = true;
	return products;
}
