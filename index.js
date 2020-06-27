import { readFileSync } from "fs";
import { createServer } from "https";
import express from "express";

import telegramHookHandler, { queries } from "./modules/telegramHookHandler.js";
import sendScore from "./modules/sendScore.js";

import config from "./secrets/config.js";
const { telegramWebhookPath } = config;

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post(`/${telegramWebhookPath}`, telegramHookHandler);

app.get("/highscore/:score", (req, res) => {
  if (!(req.query.id in queries && req.params?.score < 60)) return res.sendStatus(404);
  const query = queries[req.query.id];
  const options = query.message
    ? {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
      }
    : {
        inline_message_id: query.inline_message_id,
      };
  options.user_id = query.from.id;
  options.score = req.params.score;
  sendScore(options);
  res.sendStatus(200);
});

createServer(
  {
    key: readFileSync("secrets/server.key", "utf8"),
    cert: readFileSync("secrets/server.crt", "utf8"),
  },
  app
).listen(443);
