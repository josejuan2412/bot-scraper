const { Discovery } = require("./discover");
const { Browser } = require("../scraper/browser");

describe.only("Discover Untracked Products", () => {
  beforeEach(() => {
    jest.setTimeout(500000);
  });
  test("get all asin from URL", async () => {
    const browser = await Browser.build();
    const url =
      "https://www.amazon.com/s?i=computers&bbn=10158976011&rh=n%3A10158976011%2Cn%3A172282%2Cn%3A541966%2Cn%3A13896617011%2Cn%3A565108%2Cp_n_feature_thirty-three_browse-bin%3A23720418011%7C23720419011%2Cp_36%3A-35000%2Cp_89%3AASUS%7CAcer%7CApple%7CHP%7CLG%7CLenovo%7CMSI%7CMicrosoft%7CSAMSUNG&s=price-asc-rank&dc&qid=1664844377&rnid=2528832011&ref=sr_pg_1";
    const keywords = [
      "i5",
      "i7",
      "Ryzen 7",
      "Ryzen 9",
      "Gaming",
      "RTX",
      "AMOLED",
      "Apple",
    ];
    const discovery = new Discovery();
    const response = await discovery.fetchProducts(url, browser, keywords);
    expect(response).not.toBe(null);
  });
});
