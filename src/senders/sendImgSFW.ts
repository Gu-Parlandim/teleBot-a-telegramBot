import TelegramBot from "node-telegram-bot-api";
import { AnimeType, getAnimeImage } from "../utils/animes/animeApi";
import { isValidUrl } from "../utils/isValidUrl";

class SenderImgSFW {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.onText(/\/imageanime/, async (msg) => {
      const animeUrl = await getAnimeImage(AnimeType.SFW);

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

export default SenderImgSFW;
