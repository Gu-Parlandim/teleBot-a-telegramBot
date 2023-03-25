import TelegramBot from "node-telegram-bot-api";
import { AwaitingMusicDB } from "../db";
import SenderMusic from "./sendMusic";

class ProcessAnyMessage {
  private bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;

      if (AwaitingMusicDB.isAwaitingMusic(chatId)) {
        await SenderMusic.sendMusic(chatId, msg.text || "", this.bot);
        return;
      }

      // this.bot.sendMessage(chatId, "Received your message");
      return;
    });
  }
}

export default ProcessAnyMessage;
