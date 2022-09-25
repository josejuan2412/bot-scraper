const AWS = require("aws-sdk");
require("dotenv/config");
// TODO
// Pagina de referencia
// https://aws.plainenglish.io/invocation-of-one-lambda-from-another-f233d578bdeb

describe.only("Track Offer Lambda", () => {
  let config;
  beforeAll(() => {
    config = {
      region: process.env.DEFAULT_REGION,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    };
    AWS.config.update(config);
  });

  test("Invoke lambda that track products", async () => {
    const lambda = new AWS.Lambda();
    const data = {
      asin: "B08X1C8TK9",
      price: 100,
      description:
        "EVGA SuperNOVA 850 GT, 80 Plus Gold 850W, Fully Modular, Auto Eco Mode with FDB Fan, 7 Year Warranty, Includes Power ON Self Tester, Compact 150mm Size, Power Supply 220-GT-0850-Y1",
    };
    const params = {
      FunctionName:
        "arn:aws:lambda:us-east-1:127729251872:function:track-offers",
      //InvocationType: "RequestResponse",
      LogType: "Tail",
      Payload: JSON.stringify(data),
    };
    const response = await lambda
      .invoke(params, (err, data) => {
        if (err) {
          throw err;
        }
        console.log("Lambda invoke successfully ", data.Payload);
      })
      .promise();
    expect(response).toBeDefined();
  }, 50000);
});
