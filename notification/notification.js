class Notification {
  async sendNotification(title, price, asin, checkoutUrl) {
    throw new Error("sendNotification method not implemented");
  }
}

class DiscordNotification extends Notification {
  async sendNotification(title, price, asin, checkoutUrl) {
    return null;
  }
}

module.exports = {
  DiscordNotification,
};
