import TelegramBot from "node-telegram-bot-api";
import { getAnimImage } from "../utils/animes/animeApi";
import { isValidUrl } from "../utils/isValidUrl";

class SenderImgNSFAlt {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.onText(/\/animealt/, async (msg) => {
      const animeUrl = await getAnimImage();

      if (!animeUrl)
        return this.bot.sendMessage(
          msg.chat.id,
          "Não foi possível encontrar uma imagem :("
        );

      if (!isValidUrl(animeUrl)) {
        return this.bot.sendMessage(
          msg.chat.id,
          "Não foi possível encontrar uma imagem :( \n Tente novamente"
        );
      }

      this.bot.sendPhoto(msg.chat.id, animeUrl);
    });
  }
}

export default SenderImgNSFAlt;
