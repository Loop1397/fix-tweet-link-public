module.exports = (inputURL) => {
    let spoiled = 0;

    //스포처리된 URL 확인
    if(inputURL.startsWith("||")) {
        inputURL = inputURL.substr(2).slice(0, -2);
        console.log(inputURL);
        spoiled = 1;
    }

    // 입력된 URL이 "https://x.com" 또는 "https://twitter.com"으로 시작할 경우
    if (inputURL.startsWith("https://x.com") || inputURL.startsWith("https://twitter.com")) {
        // 또한, URL에 "status"가 포함되어있을 경우 "https://vxtwitter.com~"으로 대체
        if(inputURL.indexOf('status') !== -1) {
            inputURL = `[트윗](` + inputURL.replace(/^https:\/\/(x\.com|twitter\.com)/, "https://vxtwitter.com") + `)`;
        }
    }

    if (spoiled) {
        return `||` + inputURL + `||`;
    }

    // 조건에 해당하지 않으면 그대로 반환
    return inputURL;
}


// 테스트
// let originalURL = "https://x.com/example";
// let transformedURL = transformURL(originalURL);

// console.log("Original URL:", originalURL);
// console.log("Transformed URL:", transformedURL);

//테스트
/*
const URL = (inputURL) => {
    let spoiled = 0;

    //스포처리된 URL 확인
    if(inputURL.startsWith("||")) {
        inputURL = inputURL.substr(2).slice(0, -2);
        console.log(inputURL);
        spoiled = 1;
    }

    // 입력된 URL이 "https://x.com" 또는 "https://twitter.com"으로 시작할 경우
    if (inputURL.startsWith("https://x.com") || inputURL.startsWith("https://twitter.com")) {
        // 또한, URL에 "status"가 포함되어있을 경우 "https://vxtwitter.com~"으로 대체
        if(inputURL.indexOf('status') !== -1) {
            inputURL = `[트윗](` + inputURL.replace(/^https:\/\/(x\.com|twitter\.com)/, "https://vxtwitter.com") + `)`;
        }
    }

    if (spoiled) {
        return `||` + inputURL + `||`;
    }

    // 조건에 해당하지 않으면 그대로 반환
    return inputURL;
}

console.log(URL("https://x.com/status/hello"));
*/