import { get } from "https";
import config from "../secrets/config.js";

const { botToken } = config;

export default params => {
  const scoreURL = new URL(`/bot${botToken}/setGameScore`, "https://api.telegram.org");
  for (const param in params) scoreURL.searchParams.set(param, params[param]);
  console.log(scoreURL.toString());
  get(scoreURL.toString());
};
