// Este es el entry point del lambda que trackea un solo asin
const { trackOffers } = require("./track-offers");
const MAX_COUNT = 5;

async function trackMultipleOffers({ products, browser }) {
  return new Promise(async (resolve) => {
    products = products.map((p, i) => {
      p.index = i;
      return p;
    });
    let count = 1;
    do {
      const promiseGroup = [[]];
      for (let product of products) {
        product = clone(product);
        const lastIndex = promiseGroup.length - 1;
        // Adds promises until it reaches the max;
        if (promiseGroup[lastIndex].length < MAX_COUNT) {
          promiseGroup[lastIndex].push(processProduct(product, browser, count));
          continue;
        }

        // If the group is full, it creates a new group and add the promise
        promiseGroup.push([processProduct(product, browser, count)]);
      }

      // Loop through all the groups and process them in parallel
      // It process one group at a time
      for (const group of promiseGroup) {
        await Promise.all(group);
      }
      count += 1;
    } while (true);
    resolve({ success: true });
  });
}

async function processProduct(product, browser, count) {
  const { asin, price, description, index } = product;
  try {
    console.log(
      `Intent #${count}-${index + 1} tracking asin "${asin}". TS: `,
      new Date()
    );
    await trackOffers({ browser, asin, price, description });
    console.log(
      `Success #${count}-${index + 1} tracking "${asin}". TS: `,
      new Date()
    );
  } catch (e) {
    console.log(
      `Error #${count}-${index + 1} tracking "${asin}". TS: `,
      new Date(),
      "\n",
      e.message
    );
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  trackMultipleOffers,
};
