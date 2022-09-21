const { DiscordNotification } = require("./notification");

describe.only("Discord", () => {
  test("Send a notification", async () => {
    const notification = new DiscordNotification();
    const response = await notification.sendNotification(
      "1021950299528761406",
      "9qkIAagmYG1DuEZDHsuyLSFg1bOIzo9Z_gRw-V9YkeL62dh7Y_rc-kvKW8_h5-erni_l",
      "B07PXGQC1Q",
      100,
      "Apple AirPods (2nd Generation) Wireless Earbuds with Lightning Charging Case Included. Over 24 Hours of Battery Life, Effortless Setup. Bluetooth Headphones for iPhone",
      "https://www.amazon.com/gp/checkoutportal/enter-checkout.html?buyNow=1&skipCart=1&offeringID=1J8FUxv416nZJLFamt4D0OJTjeqKXGsQxYLT%2Bwzclg3GWYQvqID9kQ5wv89FKYdSa0u3YVRxaaxqvH5wHeFStLWoBbdxdBKRc9jTo4pdu1q4tt0tRlbKEPLt%2FtCL1%2BPOODL01bVKe70tsVMpE1zKwnZkrFYXgmkkwOzbvei46yyXv1vOKVTGgkV7p1%2FNY9%2FJ&quantity=1",
    );
    expect(response).not.toBe(null);
  });
});
