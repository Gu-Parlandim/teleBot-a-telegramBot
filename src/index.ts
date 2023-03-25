import TelegramBot from "node-telegram-bot-api";
import * as dotenv from "dotenv";
import SenderStart from "./senders/sendStart";
import SenderGetId from "./senders/sendGetId";
import SenderImgSFW from "./senders/sendImgSFW";
import SenderRandomImages from "./senders/sendRandomImg";
import SenderImgNSFAlt from "./senders/sendImgSFWAlt";
import SenderMusic from "./senders/sendMusic";
import ProcessAnyMessage from "./senders/onAnyMessage";
import UpdateListOFCommands from "./senders/updateListOfCommands";
import SenderReminder from "./senders/sendReminder";
import { startBot } from "./utils/onBotInit";
dotenv.config();

// Replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN || "YOUR_TELEGRAM_BOT_TOKEN";
const myBot = new TelegramBot(token, { polling: true });

new SenderStart(myBot);
new SenderGetId(myBot);
new SenderImgSFW(myBot);
new SenderRandomImages(myBot);
new SenderImgNSFAlt(myBot);
new SenderMusic(myBot);
new ProcessAnyMessage(myBot);
new SenderReminder(myBot);
//new UpdateListOFCommands(myBot);

startBot(myBot);
