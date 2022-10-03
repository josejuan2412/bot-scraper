// Este es el entry point del lambda que trackea un solo asin
const { Browser } = require("./scraper/browser");
const { trackMultipleOffers } = require("./lambda/track-multiple-offers");
const { product } = require("puppeteer-core");

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

async function run({ products }) {
  console.log("AQUI INICIA EL LAMBDA");
  console.log(products);
  return new Promise(async (resolve) => {
    console.log(`SETUP BROWSER`);
    const browser = await Browser.build();
    await trackMultipleOffers({ products, browser });
    resolve();
  });
}
