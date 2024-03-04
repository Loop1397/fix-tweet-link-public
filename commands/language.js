const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription('Set the language of the response of server.')
        .addStringOption(option =>
            option.setName('selected')
                .setDescription('Available language')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: '한국어', value: 'ko' },
                )),
	async execute(interaction) {
		// Administrator권한이 필요함
        if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const localizing = require('../localizing.js');
            const selectedOption = interaction.options.getString('selected');
    
            localizing.patchServerLanguage(interaction.guildId, selectedOption);
    
            if(selectedOption === 'en') {
                await interaction.reply('English selected!');
            } else if(selectedOption === 'ko') {
                await interaction.reply('한국어로 변경되었습니다!');
            }
        } else {
            await interaction.reply({ content: 'You need Administrator permission to change language.', ephemeral: true });
        }
	},
};