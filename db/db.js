const AWS = require("aws-sdk");
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
  db = null;
  constructor() {
    super();
    const config = {
      region: process.env.AWS_DEFAULT_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
    AWS.config.update(config);
    this.db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
  }
  async getProducts() {
    var params = {
      TableName: "Products",
      FilterExpression: "blacklist = :blacklist",
      ExpressionAttributeValues: {
        ":blacklist": {
          BOOL: false,
        },
      },
    };
    var result = await this.db.scan(params).promise();
    return result.Items.map(this.mapProduct) || [];
  }
  async getOffers(id) {
    var params = {
      TableName: "Offers",
      KeyConditionExpression: "asin = :asin",
      ExpressionAttributeValues: {
        ":asin": {
          S: id,
        },
      },
    };
    var result = await this.db.query(params).promise();
    return result.Items.map(this.mapOffers) || [];
  }

  mapProduct(item) {
    const { asin, description, created_at, price } = item;
    return {
      asin: asin.S,
      description: description.S,
      createdAt: new Date(created_at.S),
      price: parseFloat(`${price.N}`),
    };
  }

  mapOffers(item) {
    const { asin, price, offer_id, checkout_url, expire_at } = item;
    return {
      asin: asin.S,
      price: parseFloat(`${price.N}`),
      offerId: offer_id ? offer_id.S : undefined,
      checkoutUrl: checkout_url ? checkout_url.S : undefined,
      expireAt: expire_at ? parseFloat(`${expire_at.N}`) : undefined,
    };
  }
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
