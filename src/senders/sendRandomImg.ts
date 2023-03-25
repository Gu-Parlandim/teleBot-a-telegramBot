import TelegramBot from "node-telegram-bot-api";
import { getManyRandomAnimeImage } from "../utils/animes/animeApi";
import { isValidUrl } from "../utils/isValidUrl";

class SenderRandomImages {
  bot: TelegramBot;

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.onText(/\/randomimage/, async (msg) => {
      const listOfUrls = await getManyRandomAnimeImage();

      if (!listOfUrls || listOfUrls.length <= 0)
        return this.bot.sendMessage(
          msg.chat.id,
          "Não foi possível encontrar uma imagem :("
        );

      for (const url of listOfUrls) {
        if (!isValidUrl(url.url)) {
          return this.bot.sendMessage(
            msg.chat.id,
            "Não foi possível encontrar uma imagem :( \n Tente novamente"
          );
        }

        this.bot.sendPhoto(msg.chat.id, url.url);
      }
    });
  }
}

export default SenderRandomImages;
