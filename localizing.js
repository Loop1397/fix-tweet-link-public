const fs = require('fs');
const path = require('path');
const language = require('./commands/language');
const configPath = path.join(__dirname, 'server-language-config.json');

const data = fs.readFileSync(configPath, 'utf8');
const serverLanguageConfig = JSON.parse(data);

const output = {
    "ko" : " 님이 공유한 [트윗](",
    "en" : " sent a [tweet]("
}

module.exports = {
    /**
     * getLocalizedString : 서버 설정에 따른 문구를 출력해주는 메소드
     * 현재 "en", "ko"을 지원하며 "en"이 기본 설정
     */
    getLocalizedString(guildId) {
        const config = serverLanguageConfig[guildId];

        // guildId의 언어 설정이 json파일에 입력되어 있다면 해당 언어 반환
        if (config !== undefined) {
            return output[serverLanguageConfig[guildId]];
        }
    
        //아닐 경우 기본 언어를 영어로하여 json파일에 저장 
        this.patchServerLanguage(guildId, 'en');
        console.log(`새로운 서버의 데이터 입력. guildId = ${guildId}`)
        
        return output['en']
    },

    patchServerLanguage(guildId, language) {
        serverLanguageConfig[guildId] = language;
    
    
        const jsonData = JSON.stringify(serverLanguageConfig);
        
        // writeFile에서 Sync를 붙이면 동기로 실행되는 메소드가 됨 
        fs.writeFileSync(configPath, jsonData, 'utf8');

    }
}


/* 테스트용


console.log(getLocalizedString('1051065667043999744'));
*/