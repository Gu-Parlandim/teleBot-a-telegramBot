import TelegramBot from "node-telegram-bot-api";
import { AwaitingMusicDB } from "../db";
import { getYoutubeAudio, IAudio } from "../utils/youtube/downloadAudio";

class SenderMusic {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.onText(/\/baixarmusica/, async (msg) => {
      AwaitingMusicDB.addAwaitingMusic(msg.chat.id);
      return this.bot.sendMessage(msg.chat.id, "Informe o nome de uma música");
    });
  }

  static async sendMusic(chatId: number, musicName: string, bot: TelegramBot) {
    if (!musicName)
      return bot.sendMessage(chatId, "Informe o nome de uma música");

    bot.sendMessage(chatId, "Aguarde enquanto baixo a música");

    const audio = ((await getYoutubeAudio(musicName)) as IAudio) || "error";

    if (typeof audio === "string" || !audio) {
      bot.sendMessage(chatId, "Não foi possível encontrar");
      AwaitingMusicDB.removeAwaitingMusic(chatId);
      return;
    }

    const fileOptions: TelegramBot.FileOptions = {
      filename: audio.title,
      contentType: audio.type,
    };

    bot.sendAudio(chatId, audio.buffer, {}, fileOptions);
    AwaitingMusicDB.removeAwaitingMusic(chatId);
  }
}

export default SenderMusic;
