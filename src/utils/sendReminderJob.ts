import TelegramBot from "node-telegram-bot-api";
import storage from "node-persist";

export function sendReminderJob(
  bot: TelegramBot,
  text: string,
  chatId: number,
  date: Date | string,
  key: string,
  repeat: boolean,
  id: string
) {
  return async () => {
    bot.sendMessage(chatId, `Lembrete: ${text || ""}`);
    if (!repeat) return storage.removeItem(key);

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    await storage.updateItem(key, { chatId, text, repeat, time: newDate, id });
  };
}
