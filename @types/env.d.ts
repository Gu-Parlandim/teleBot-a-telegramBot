// create a type for telegram token
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELEGRAM_TOKEN: string;
      YOUTUBE_API_TOKEN: string;
      NEKOS_API: string;
      PiCS_API: string;
      OPENAI_API_KEY: string;
      OPENAI_ORGANIZATION: string;
    }
  }
}

export {};
