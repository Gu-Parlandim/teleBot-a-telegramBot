import TelegramBot from "node-telegram-bot-api";

class UpdateListOFCommands {
  bot: TelegramBot;
  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.bot.setMyCommands([
      { command: "start", description: "começar a usar" },
      { command: "getid", description: "id da conversa" },
      {
        command: "novolembrete",
        description: "Criar um lembrete para qualquer horário ou data",
      },
      {
        command: "meuslembretes",
        description: "Ver os lembretes que você criou",
      },
      {
        command: "baixarmusica",
        description: "Baixe qualquer música do youtube",
      },
      { command: "imageanime", description: "Uma imagem de anime aleatória" },
      {
        command: "randomimage",
        description:
          "5 imagens de animes aleatórias (obs: é possível que passe algo +18)",
      },
      {
        command: "animealt",
        description:
          "Uma imagem de anime aleatória (alternativa para a outra opção acima",
      },
    ]);
  }
}

export default UpdateListOFCommands;
