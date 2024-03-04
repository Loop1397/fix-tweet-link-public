// import transformURL from "./transformURL.js";
const transformURL = require("./transformURL.js");
// 필요한 discord.js 클래스를 require합니다.
const { Client, Events, GatewayIntentBits, Partials, Collection } = require("discord.js");
require("dotenv").config();
const path = require('path');
const fs = require('fs');
const localizing = require("./localizing.js");

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

// slash command를 사용하기 위한 베이스 설정
client.commands = new Collection();
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
});

// 클라이언트가 준비되면, 코드를 실행합니다. (딱 한번만)
client.once("ready", async () => {
    console.log("Ready!");
});

/**
 * slash command
 */
client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
    
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

/**
 * 메세지가 입력됐을 때 실행되는 메소드
 */
client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;
    
    result = transformURL(message.content);
    const channel = client.channels.cache.get(message.channelId);

    if (message.content !== result) {
        message.delete();
        channel.send(message.author.toString() + localizing.getLocalizedString(message.guild.id) + result)
            .then(message => {
                message.react(`❌`);
            });
    }
});

/**
 * 리액션이 달렸을 때 실행되는 메소드
 */
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
