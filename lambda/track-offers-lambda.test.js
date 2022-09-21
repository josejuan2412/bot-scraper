const AWS = require("aws-sdk");

// TODO
// Pagina de referencia
// https://aws.plainenglish.io/invocation-of-one-lambda-from-another-f233d578bdeb

describe.only("Track Offer Lambda", () => {
  let config;
  before(() => {
    config = {
      region: process.env.AWS_DEFAULT_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
    AWS.config.update(config);
  });

  test("Invoke lambda that track products", async () => {
    const lambda = new AWS.Lambda();
    const data = {
      asin: "",
      price: 20,
      description: "",
    };
    const params = {
      FunctionName: "", // ARN name of the lambda
      InvoicationType: "RequestResponse",
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
  });
});
