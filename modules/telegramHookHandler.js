import config from "../secrets/config.js";
const { gameName, gamePath } = config;

export const queries = {};

export default (req, res) => {
  if (req.body?.message?.text) {
    const {
      message: { text, chat },
    } = req.body;
    if (text === "/help")
      res.json({
        method: "sendMessage",
        chat_id: chat.id,
        text: "Let's test how good you remember your roll numbers. Say /game if you want to play.",
      });
    else if (text === "/start" || text === "/game")
      res.json({
        method: "sendGame",
        chat_id: chat.id,
        game_short_name: gameName,
      });
  } else if (req.body?.inline_query) {
    res.json({
      method: "answerInlineQuery",
      inline_query_id: req.body.inline_query.id,
      results: [{ type: "game", id: "0", game_short_name: gameName }],
    });
  } else if (req.body?.callback_query?.game_short_name === gameName) {
    const { callback_query: query } = req.body;
    queries[query.id] = query;

    const gameUrl = new URL(gamePath);
    gameUrl.searchParams.set("id", query.id);

    res.json({
      method: "answerCallbackQuery",
      callback_query_id: req.body.callback_query.id,
      url: gameUrl,
    });
  } else {
    res.status(200).send();
  }
};
