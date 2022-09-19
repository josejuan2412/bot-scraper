const axios = require("axios").default;
const cheerio = require("cheerio");

class Discovery {
  async fetchProducts(url) {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:50.0) Gecko/20100101 Firefox/50.0",
      },
    });
    console.log(response);
    const html = response.data;
    const $ = cheerio.load(html);
    const products = [];
    $(
      "div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20",
    ).each((_idx, el) => {
      const asin = el.attribs["data-asin"];
      const product = $(el);
      const title = product
        .find("span.a-size-base-plus.a-color-base.a-text-normal")
        .text();
      let element = {
        title,
        asin,
      };
      products.push(element);
    });
    return products;
  }
}

module.exports = {
  Discovery,
};
