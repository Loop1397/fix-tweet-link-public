const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'server-language-config.json');

const data = fs.readFileSync(configPath, 'utf8');
const serverLanguageConfig = JSON.parse(data);

module.exports = {
    // getter
    getServerLanguage(guildId) {
        let result = serverLanguageConfig[guildId];

        // guildId의 언어 설정이 json파일에 입력되어 있다면 해당 언어 반환
        if (result !== undefined) {
            return result;
        }

        result = 'en';

        //아닐 경우 기본 언어를 영어로하여 json파일에 저장 
        this.setServerLanguage(guildId, result);
        console.log(`새로운 서버의 데이터 입력. guildId = ${guildId}`)
        
        return result;
    },

    //setter
    setServerLanguage(guildId, language) {
        serverLanguageConfig[guildId] = language;
    
        const jsonData = JSON.stringify(serverLanguageConfig);
        
        // writeFile에서 Sync를 붙이면 동기로 실행되는 메소드가 됨 
        fs.writeFileSync(configPath, jsonData, 'utf8');
    }
}
