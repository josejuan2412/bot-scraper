import * as cheerio from "cheerio";
import * as puppeteer from "puppeteer";
import { EmbedBuilder, WebhookClient } from "discord.js";
import { getProducts } from "./db/products.js";
import { offerExists } from "./db/offers.js";

// Db
// Notification
// Scraper

async function configureBrowser(product) {
  const url = `https://smile.amazon.com/dp/${product}?aod=1`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function checkPrice(page, priceTarget, product) {
  try {
    // page.reload(); //verify if there is a way to prevent this
    let html = await page.evaluate(() => document.body.innerHTML);
    const $ = cheerio.load(html);
    let offerList = [];
    $("#aod-offer-list", html).each((id, item) => {
      const list = $(item);
      const offer = list.find("#aod-offer");
      offer.each((index, row) => {
        let seller = $(row).find("#aod-offer-soldBy");
        const provider = $(seller)
          .find("div.a-fixed-left-grid-col.a-col-right")
          .text();
        if (provider.trim() === "Amazon Warehouse") {
          let buttonDiv = $(row).find(
            "div.a-fixed-right-grid-col.aod-atc-column.a-col-right"
          );
          let offerElement = $(buttonDiv).find("span.a-declarative");
          const offerAttribute = offerElement[0].attribs["data-aod-atc-action"];
          const offerPrice = parseFloat(
            $(row).find("span.a-offscreen").text().substring(1)
          );
          const offerID = JSON.parse(offerAttribute).oid;
          if (offerPrice < priceTarget)
            offerList.push({
              price: offerPrice,
              seller: "Amazon Warehouse",
              offerID: offerID,
              ASIN: product,
              checkoutUrl: `https://smile.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=${offerID}&quantity=1`,
            });
        }
      });
    });
    return offerList;
  } catch (error) {
    throw error;
  }
}

async function startTracking() {
  //let products = await getProducts();
  let products = [
    { asin: "B09G9FWZ28", price: 260.0, description: "apple watch" },
  ];
  for (let index = 0; index < products.length; index++) {
    const product = products[index].asin;
    console.log("tracking: ", product);
    const price = parseFloat(products[index].price);
    const page = await configureBrowser(product);
    let offers = await checkPrice(page, price, product);
    console.log(offers);
    if (offers.length > 0) {
      for (let row = 0; row < offers.length; row++) {
        const offerExist = true; //await OfferExists(products[index].id, offers[row].price)
        if (offerExist) {
          // let newOffer = await insertOffer(products[index].id, offers[row]);

          const webhookClient = new WebhookClient({
            id: "1017555269368160287",
            token:
              "grZXD5AzkImSxwzmHsM_J6Ewv01UBRx8GKTuEknHiGsR1fL_SfIiDCpCTYKg57W-j6cK",
          });

          const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(
              `[$${offers[row].price}] - ${products[index].description}`
            )
            .setDescription("Warehouse - ASIN tracker")
            .setURL(`https://smile.amazon.com/dp/${products[index].asin}?aod=1`)
            .addFields({
              name: "Checkout URL:",
              value: offers[row].checkoutUrl,
              inline: true,
            })
            .setTimestamp();
          //DISCORD NOTIFICATION
          // await webhookClient.send({
          //   avatarURL: "",
          //   embeds: [embed],
          // });
        }
      }
    }
  }
}

startTracking();
