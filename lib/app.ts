import { BotFrameworkAdapter } from "botbuilder";
import { QnAMaker } from "botbuilder-ai";
import { IQnAService , BotConfiguration } from "botframework-config";
import * as restify from "restify";
import { ConfBot } from "./bot";
import { config } from 'dotenv';

config();
const botConfig = BotConfiguration.loadSync("./IteraChatBot.bot",process.env.BOT_FILE_SECRET);

console.log(botConfig);


const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(server.name + " listening on " + server.url);
});

const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const qnAMaker = new QnAMaker({
    knowledgeBaseId: (<IQnAService>botConfig.findServiceByNameOrId("ChatBotIteraQna")).kbId,
    endpointKey : (<IQnAService>botConfig.findServiceByNameOrId("ChatBotIteraQna")).endpointKey,
    host : (<IQnAService>botConfig.findServiceByNameOrId("ChatBotIteraQna")).hostname
});

console.log(qnAMaker);

const echo : ConfBot = new ConfBot(qnAMaker);

server.post("/api/messages", (req, res)=> {
    adapter.processActivity(req, res, async (context) => {
        await echo.onTurn(context);
    });
});