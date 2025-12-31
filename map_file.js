
const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        let info = line.trim();
        if (info.length > 100) info = info.substring(0, 100) + '...';

        // key markers
        if (info.includes('<section') || info.includes('<div') || info.includes('<h1') || info.includes('<h2') || info.includes('<h3') || info.includes('<ul') || info.includes('<li') || info.includes('class=')) {
            console.log(`${lineNum}: ${info}`);
        }
    }
}

processLineByLine();
