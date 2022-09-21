const { EmbedBuilder, WebhookClient } = require("discord.js");

class Notification {
  async sendNotification(title, price, asin, checkoutUrl) {
    throw new Error("sendNotification method not implemented");
  }
}

class DiscordNotification extends Notification {
  async sendNotification(
    discordId,
    discordToken,
    asin,
    price,
    title,
    checkoutUrl,
  ) {
    const webhookClient = new WebhookClient({
      id: discordId,
      token: discordToken,
    });
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`[$${price}] - ${title}`)
      .setDescription("Warehouse - ASIN tracker")
      .setTimestamp()
      .setURL(`https://smile.amazon.com/dp/${asin}?aod=1`)
      .addFields({
        name: "Checkout URL:",
        value: checkoutUrl,
        inline: true,
      });

    await webhookClient.send({
      avatarURL: "",
      embeds: [embed],
    });
    return embed;
  }
}

module.exports = {
  DiscordNotification,
};
