class Db {
  async getProducts() {
    throw new Error("getOffers method not implemented");
  }

  async getOffers(id) {
    throw new Error("getOffers method not implemented", id);
  }

  async upsertOffer(offer) {
    throw new Error("getOffers method not implemented", offer);
  }
}

class DynamoDb extends Db {
  config = null;
  constructor() {
    this.config = {
      region: process.env.AWS_DEFAULT_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.WWCf9S9EFlsQqWkKhoV4uSQLNbnhk8Qs56K9s6Ky,
    };
  }
  async getProducts() {
    return [];
  }
  async getOffers(id) {}
}

module.exports = {
  Db,
  DynamoDb,
};

/*
function Scheluder() {
  const dynamoDb = new DynamoDb();

  const products = dynamoDb.getProducts();
  const promises = [];
  for (const product of products) {
    promises.push(launchLambda(product.id, product.price));
  }
  await Promise.all(promises);
}

function launchLambda(id, price) {}
*/
