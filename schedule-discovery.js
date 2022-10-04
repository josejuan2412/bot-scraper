const { Schedule } = require("./lambda/schedule-discovery");

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: null,
  };
  try {
    response.body = await run(event);
  } catch (e) {
    response.statusCode = 500;
    response.body = {
      success: false,
      error: e.message,
    };
  }
  return response;
};

async function run() {
  return new Promise(async (resolve, reject) => {
    try {
      await Schedule();
    } catch (e) {
      console.log(
        `Error trying to schedule trackings `,
        new Date(),
        "\n",
        e.message,
      );
    }
    resolve({ success: true });
  });
}
