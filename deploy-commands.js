/**
 * 글로벌 slash command를 초기화 한 후 재등록하는 파일.
 */

const { REST, Routes } = require("discord.js");
const path = require('path');
const fs = require('fs');

// bot token을 환경변수 설정으로 받아옴
const token = process.env.BOT_TOKEN;
//application-id
const clientId = '1194553186304937984';

const slashCommands = [];
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const filePath = path.join(commandPath, file);
    console.log(filePath);
    const command = require(filePath);

    if('data' in command && 'execute' in command) {
        slashCommands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
});

/**
 * slash commands를 등록하기 위한 REST 모듈 갖고오기
 */
const rest = new REST().setToken(token);

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, '1051065667043999744'), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${slashCommands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: slashCommands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();