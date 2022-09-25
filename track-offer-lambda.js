// Este es el entry point del lambda que trackea un solo asin
const { trackOffers } = require("./lambda/track-offers");
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

// TODO Aqui pones la logica del interval
async function run({ asin, price, description }) {
  return new Promise(async (resolve, reject) => {
    const seconds = 15;
    let count = 0;
    const interval = setInterval(async () => {
      if (count === MAX_COUNT) {
        clearInterval(interval);
        resolve({ success: true });
      }
      try {
        await trackOffers(asin, price, description);
      } catch (e) {
        reject(e);
      }
      count += 1;
    }, seconds);
  });
}
