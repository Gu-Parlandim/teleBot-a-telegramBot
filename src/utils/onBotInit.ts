import TelegramBot from "node-telegram-bot-api";
import storage from "node-persist";
import { scheduleJob } from "node-schedule";

export async function startBot(bot: TelegramBot) {
  console.log("Bot started");

  // recupera os lembretes armazenados e reagenda as tarefas
  await storage.init();
  const reminders = await storage.values();
  reminders.forEach((reminder) => {
    const { chatId, text, time, repeat, id } = reminder;
    const key = `reminder_${chatId}_${id}`;
    scheduleJob(time, () => {
      bot.sendMessage(chatId, `Lembrete: ${text}`);
      if (!repeat) storage.removeItem(key);
    });
  });
}
