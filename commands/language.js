const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription(`Set the language of the server's response`)
        .addStringOption(option =>
            option.setName('selected')
                .setDescription('Available language')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: '한국어', value: 'ko' },
                    { name: '일본어', value: 'jp' }
                )),
	async execute(interaction) {
		// Administrator권한이 필요함
        if(interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const localizing = require('../localizing.js');
            const selectedOption = interaction.options.getString('selected');
    
            localizing.patchServerLanguage(interaction.guildId, selectedOption);
    
            if(selectedOption === 'en') {
                await interaction.reply('English selected!');
            } else if (selectedOption === 'ko') {
                await interaction.reply('한국어로 변경되었습니다!');
            } else if( selectedOption === 'jp') {
                await interaction.reply('日本語に変更されました!');
            }
        } else {
            await interaction.reply({ content: 'You need administrator permission to change language.', ephemeral: true });
        }
	},
};