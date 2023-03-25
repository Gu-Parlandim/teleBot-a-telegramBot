import axios from "axios";
import { listOfSfw, listOfAnimApi } from "./animeCategorys";
import * as dotenv from "dotenv";
dotenv.config();

export enum AnimeType {
  NSFW = "nsfw",
  SFW = "sfw",
}

const animeApi = process.env.IMAGES_H_API as string;
const picsApi = process.env.PiCS_API as string;
const nekosApi = process.env.NEKOS_API as string;

const getArandomCategory = (type: AnimeType) => {
  const randomIndex = Math.floor(Math.random() * listOfSfw.length);
  return listOfSfw[randomIndex];
};

export const getAnimeImage = async (type: AnimeType) => {
  try {
    const category = getArandomCategory(type);
    const response = await axios.get(`${picsApi}/${type}/${category}`);

    if (response.status !== 200) throw new Error("Error on get anime image");

    return response.data.url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getManyRandomAnimeImage = async () => {
  try {
    const response = await axios.get(`${nekosApi}/image/random?limit=5`);

    const listOfUrls = response.data.data as Array<{ url: string }>;

    return listOfUrls;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAnimImage = async () => {
  try {
    const randomIndex = Math.floor(Math.random() * listOfAnimApi.length);
    const category = listOfAnimApi[randomIndex];

    const response = await axios.get(`${animeApi}/sfw/${category}`);

    if (response.status !== 200) throw new Error("Error on get anime image");

    return response.data.url;
  } catch (error) {
    console.log(error);
    return null;
  }
};
