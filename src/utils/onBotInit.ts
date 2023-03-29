import TelegramBot from "node-telegram-bot-api";
import storage from "node-persist";
import { scheduleJob } from "node-schedule";
import { dateTimeToCron } from "./dateTimeToCron";
import { sendReminderJob } from "./sendReminderJob";

export async function startBot(bot: TelegramBot) {
  console.log("Bot started");

  // recupera os lembretes armazenados e reagenda as tarefas
  await storage.init();
  const reminders = await storage.values();
  reminders.forEach((reminder) => {
    const { chatId, text, time, repeat, id } = reminder;

    let cron = time;

    if (repeat) {
      cron = dateTimeToCron(time);
    }

    const key = `reminder_${chatId}_${id}`;

    scheduleJob(
      key,
      cron,
      sendReminderJob(bot, text, chatId, time, key, repeat, id)
    );
  });
}
