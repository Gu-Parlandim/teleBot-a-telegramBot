import TelegramBot from "node-telegram-bot-api";

class SenderGetId {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.onText(/\/getid/, (msg) => {
      this.bot.sendMessage(msg.chat.id, msg.chat.id.toString());
    });
  }
}

export default SenderGetId;
