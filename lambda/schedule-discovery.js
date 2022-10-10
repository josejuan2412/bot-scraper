const AWS = require("aws-sdk");
require("dotenv/config");

async function Schedule() {
  const properties = [];
  let promises = [];
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  for (let i = 0; i < properties.length; i++) {
    var params = {
      FunctionName:
        "arn:aws:lambda:us-east-1:127729251872:function:track-offers",
      InvocationType: "Event",
      Payload: JSON.stringify({
        url: properties[i].url,
        keywords: properties[i].keywords,
      }),
    };
    promises.push(discoverUrl(params, i));
  }
  await Promise.all(promises);
}

function discoverUrl(params, index) {
  return new Promise((resolve, reject) => {
    var lambda = new AWS.Lambda();
    lambda.invoke(params, function (err, data) {
      if (err) {
        reject(err);
      }
      console.log(`For the Lambda #${index} the data is`, data);
      resolve(data);
    });
  });
}

module.exports = {
  Schedule,
};
