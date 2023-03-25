import ytdl from "ytdl-core";
import YouTube from "simple-youtube-api";
import * as dotenv from "dotenv";
dotenv.config();

export interface IAudio {
  buffer: Buffer;
  type: string;
  title: string;
}

const token = process.env.YOUTUBE_API_TOKEN as string;
const youtube = new YouTube(token);

function writeMp3(id: string) {
  let stream = ytdl(id, {
    quality: "highestaudio",
  });

  return stream;
}

export const getYoutubeAudio = async (
  musicName: string
): Promise<IAudio | string> => {
  try {
    const searchVideos = await youtube.searchVideos(musicName, 1);
    const { id, title } = searchVideos[0];

    const readable = writeMp3(id);

    const chunks: Buffer[] = [];

    readable.on("data", (chunk) => {
      chunks.push(chunk);
    });

    return new Promise((resolve, reject) => {
      readable.on("end", () => {
        // Obter os dados como Buffer
        const buffer = Buffer.concat(chunks);

        (async () => {
          const { fileTypeFromBuffer } = await (eval(
            'import("file-type")' //@ts-ignore
          ) as Promise<typeof import("file-type")>);

          const type = await fileTypeFromBuffer(buffer);
          console.log("type: ", type);

          resolve({
            buffer,
            type: type?.mime || "video/webm",
            title: musicName,
          });
        })();

        //resolve({ buffer, type, title });
      });

      readable.on("error", (error) => {
        console.log(error);
        reject("error");
      });
    });
  } catch (error) {
    console.error(error);
    return "error";
  }
};
