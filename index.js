// import transformURL from "./transformURL.js";
const transformURL = require("./transformURL.js");
// 필요한 discord.js 클래스를 require합니다.
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
// const { clientId, token } = require("./config.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

// bot token을 환경변수 설정으로 받아옴
const token = process.env.BOT_TOKEN;

// 새 client 인스턴스를 생성합니다.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const rest = new REST({ version: "9" }).setToken(token);

// 클라이언트가 준비되면, 코드를 실행합니다. (딱 한번만)
client.once("ready", async () => {
    console.log("Ready!");
});

client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;

    result = transformURL(message.content);
    const channel = client.channels.cache.get(message.channelId);

    if (message.content !== result) {
        message.delete();
        channel.send(message.author.toString() + ` 님이 공유한 ` + result).then(message => {
            message.react(`❌`);
        });
    }
});

client.on(Events.MessageReactionAdd, reaction => {
    // console.log(reaction);
    message = reaction.message;
    message
        .fetch()
        .then(async message => {
            const reactionCount = message.reactions.cache.get(`❌`)?.count;
            if (reactionCount >= 3 && message.author.bot) {
                message.delete();
            }
        })
        .catch(e => {
            console.error("Something went wrong when fetching the message: ", e);
        });
});

// 디스코드를 클라이언트의 토큰으로 로그인합니다.
client.login(token);
