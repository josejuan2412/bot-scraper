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
  getProducts() {
    return [];
  }
}

module.exports = {
  Db,
  DynamoDb,
};
