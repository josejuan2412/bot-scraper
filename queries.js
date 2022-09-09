import { mysqlDB } from "./db.js";

export async function getAllProducts() {
  const query = "SELECT * FROM products";
  return new Promise((resolve, reject) => {
    try {
      mysqlDB.query(query, (err, rows) => {
        if (err) {
          console.log(`DB Error: ${err}`);
          reject(err);
        }
        resolve(rows);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function OfferExists(asinID, price) {
  const query = `SELECT id FROM offers WHERE asinID=${asinID} AND price = '${price}' AND DATE(createdAt) = CURDATE() LIMIT 1`;
  return new Promise((resolve, reject) => {
    try {
      mysqlDB.query(query, (err, rows) => {
        if (err) {
          console.log(`DB Error: ${err}`);
          reject(err);
        }
        if (rows && rows[0]) resolve(false);
        else resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function insertOffer(asinID, offer) {
  const query = `INSERT INTO offers(asinID, offerID, price, checkoutURL) VALUES (${asinID},'${offer.offerID}', '${offer.price}', '${offer.checkoutUrl}' )`;
  return new Promise((resolve, reject) => {
    try {
      mysqlDB.query(query, (err, rows) => {
        if (err) {
          console.log(`DB Error: ${err}`);
          reject(err);
        }
        resolve(rows.insertId);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function insertNotifications(OfferID) {
  const query = `INSERT INTO notifications(OfferID) VALUES (${OfferID} )`;
  return new Promise((resolve, reject) => {
    try {
      mysqlDB.query(query, (err, rows) => {
        if (err) {
          console.log(`DB Error: ${err}`);
          reject(err);
        }
        if (rows && rows[0]) resolve(true);
        else resolve(false);
      });
    } catch (error) {
      reject(error);
    }
  });
}
