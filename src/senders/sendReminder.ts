import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
import * as chrono from "chrono-node";
import scheduler from "node-schedule";
import { dateTimeToCron } from "../utils/dateTimeToCron";
import storage from "node-persist";
import { nanoId } from "../utils/nanoId";
import { sendReminderJob } from "../utils/sendReminderJob";
import { translateToEnglish } from "../utils/translateToEnglish";

interface IReminder {
  chatId: number;
  step: number;
  text?: string;
  date?: Date;
  repeat?: boolean;
}

class SenderReminder {
  bot: TelegramBot;
  listOfAwaitingReminders: IReminder[] = [];

  constructor(bot: TelegramBot) {
    this.bot = bot;

    this.listenerNewReminder();
    this.listenerAnyMessage();
    this.listenerGetReminders();
    this.listenerDeleteReminder();
  }

  addAwaitingReminder = (chatId: number) => {
    this.listOfAwaitingReminders.push({ chatId, step: 1 });
  };

  removeAwaitingReminder = (chatId: number) => {
    this.listOfAwaitingReminders = this.listOfAwaitingReminders.filter(
      (reminder) => reminder.chatId !== chatId
    );
  };

  isAwaitingReminder = (chatId: number) => {
    return this.listOfAwaitingReminders.some(
      (awaitingID) => awaitingID.chatId === chatId
    );
  };

  updateAwaitingReminder = (
    chatId: number,
    step: number,
    text?: string,
    date?: Date,
    repeat?: boolean
  ) => {
    this.listOfAwaitingReminders = this.listOfAwaitingReminders.map(
      (reminder) => {
        if (reminder.chatId === chatId) {
          return { ...reminder, step, text, date, repeat };
        }
        return reminder;
      }
    );
  };

  listenerNewReminder = () => {
    this.bot.onText(/\/novolembrete/, (msg) => {
      const chatId = msg.chat.id;
      this.addAwaitingReminder(chatId);
      this.bot.sendMessage(chatId, "Digite o lembrete");
    });
  };

  listenerGetReminders = () => {
    this.bot.onText(/\/meuslembretes/, (msg) => {
      const chatId = msg.chat.id;

      async function listReminders(chatId: number, bot: TelegramBot) {
        const reminders = await storage.valuesWithKeyMatch(`${chatId}`);
        if (!reminders || reminders.length === 0) {
          bot.sendMessage(chatId, "Não há lembretes agendados.");
          return;
        }
        let message = "*Lembretes agendados:*\n";
        message += "---------------------------------------------------\n";

        for (let i = 0; i < reminders.length; i++) {
          const reminder = reminders[i];
          const date = new Date(reminder.time).toLocaleString("pt-BR");
          message += `- "${reminder.text}" \n*Em*: ${date}\n`;
          message += `*Repete*: ${reminder.repeat ? "Sim" : "Não"} \n`;
          message += `*ID*: /apagar@${reminder.id} \n`;
          message += "---------------------------------------------------\n";
        }
        const opts: SendMessageOptions = {
          parse_mode: "Markdown",
        };

        bot.sendMessage(chatId, message, opts);
      }

      listReminders(chatId, this.bot);
    });
  };

  listenerDeleteReminder = () => {
    this.bot.onText(/^\/apagar@\w+\s*/, async (msg) => {
      const chatId = msg.chat.id;
      const messageId = msg.message_id;

      const id = msg.text?.split("@")[1];
      if (!id) {
        this.bot.sendMessage(chatId, "Não entendi, tente novamente");
        return;
      }

      const key = `reminder_${chatId}_${id}`;

      try {
        await storage.removeItem(key);
        const res = scheduler.cancelJob(key);
        if (!res) {
          throw new Error("Não foi possível excluir o lembrete");
        }
      } catch (error) {
        this.bot.sendMessage(chatId, "Não foi possível excluir o lembrete");
        return;
      }

      this.bot.sendMessage(chatId, "O lembrete foi excluído com sucesso", {
        reply_to_message_id: messageId,
      });
    });
  };

  listenerAnyMessage = () => {
    this.bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const reminder = this.listOfAwaitingReminders.find(
        (r) => r.chatId === chatId
      );

      if (!this.isAwaitingReminder(chatId) || !reminder) {
        return;
      }

      switch (reminder.step) {
        case 1:
          this.updateAwaitingReminder(chatId, 2, msg.text || "");
          this.bot.sendMessage(chatId, "Digite a data do lembrete");
          break;

        case 2:
          const response = await translateToEnglish(msg.text || "");

          console.log(response);

          if (response === "error") {
            this.bot.sendMessage(chatId, "Não entendi, tente novamente");
            return;
          }

          const date = chrono.parseDate(response || "in 15 seconds");

          if (!date) {
            this.bot.sendMessage(chatId, "Não entendi, tente novamente");
            return;
          }

          this.updateAwaitingReminder(chatId, 3, reminder.text || "", date);
          this.bot.sendMessage(chatId, "Repetir todos os dias? (sim/nao)");
          break;

        case 3:
          const reminderDate = reminder.date;
          const repeat = msg.text?.toLowerCase() === "sim";

          if (!reminderDate) {
            this.bot.sendMessage(chatId, "Ocorreu um erro, tente novamente");
            this.removeAwaitingReminder(chatId);
            return;
          }

          const cron = repeat ? dateTimeToCron(reminderDate) : reminderDate;

          const id = nanoId(8);
          const text = reminder.text || "";

          const key = `reminder_${chatId}_${id}`;
          const reminderObjs = {
            chatId,
            text: text,
            time: reminderDate,
            repeat: repeat,
            id: id,
          };

          scheduler.scheduleJob(
            key,
            cron,
            sendReminderJob(
              this.bot,
              text,
              chatId,
              reminderDate,
              key,
              repeat,
              id
            )
          );

          await storage.setItem(key, reminderObjs);

          this.bot.sendMessage(chatId, "Lembrete agendado");
          this.removeAwaitingReminder(chatId);

          break;

        default:
          break;
      }
    });
  };
}

export default SenderReminder;
