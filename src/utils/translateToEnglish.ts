import path from "path";
import { spawn } from "child_process";

const pythonScript = path.resolve(__dirname, "..", "python", "translate.py");

export const translateToEnglish = (text: string): Promise<string> => {
  const pythonProcess = spawn("python3", [pythonScript, text]);

  let dataToSend: string;

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on("data", (data) => {
      const bufferToString = data.toString("utf8") as string;
      dataToSend = bufferToString;
    });

    pythonProcess.stderr.on("data", (data) => {
      reject("error");
    });

    pythonProcess.on("close", (code: any) => {
      //console.log("code: ", code);
      resolve(dataToSend);
    });
  });
};
