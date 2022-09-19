const { DiscordNotification } = require("./notification");

describe("Discord", () => {
  test("Send a notification", async () => {
    const notification = new DiscordNotification();
    const response = await notification.sendNotification("", 2.99, "", "");
    expect(response).toBe(null);
  });
});
