
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    const data = fs.readFileSync(path, 'utf8');
    const lines = data.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('Walk') || line.includes('earn')) {
            console.log(`Line ${index + 1}: ${JSON.stringify(line)}`);
        }
    });
} catch (e) {
    console.error(e);
}
