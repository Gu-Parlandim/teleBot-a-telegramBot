import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";

class SenderStart {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;
    this.bot.onText(/\/start/, (msg) => {
      const opts: SendMessageOptions = {
        reply_markup: {
          keyboard: [["/novolembrete", "/baixarmusica", "/imageanime"]] as any,
        },
      };

      bot.sendMessage(msg.chat.id, "Bem vindo!", opts);
    });
  }
}

export default SenderStart;
