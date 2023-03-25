import { OpenAIApi, Configuration } from "openai";
import "dotenv/config";
const organization = process.env.OPENAI_ORGANIZATION as string;
const apiKey = process.env.OPENAI_API_KEY as string;

const configuration = new Configuration({
  organization,
  apiKey,
});

const openAi = new OpenAIApi(configuration);

export const getDavinciResponse = async (clientText: string) => {
  const options = {
    model: "text-davinci-003", // Modelo GPT a ser usado
    prompt: `traduza '${clientText}' para o ingles`, // Texto enviado pelo usuário
    temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
    max_tokens: 4000, // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
  };

  try {
    const response = await openAi.createCompletion(options);
    let botResponse = "";
    response.data.choices.forEach(({ text }) => {
      botResponse += text;
    });
    return `${botResponse.trim()}`;
  } catch (e) {
    console.log(e);
    return `error`;
  }
};
