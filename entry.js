const { Products } = require("./products/products");
const { trackOffers } = require("./lambda/lambda");

async function schedule() {
  const productList = new Products();
  const products = await productList.getProducts();
  let promises = [];
  for (const product of products) {
    promises.push(
      await trackOffers(product.asin, product.price, product.description),
    );
  }
  Promise.all(promises); //await required?
  console.log("promises sent");
}

schedule();
