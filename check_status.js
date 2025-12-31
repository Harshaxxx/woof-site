
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

const stream = fs.createReadStream(path, { encoding: 'utf8' });
let content = '';
let revealCount = 0;
let hasScript = false;

stream.on('data', (chunk) => {
    // simple check for class="reveal"
    const matches = (chunk.match(/class="[^"]*reveal/g) || []).length;
    revealCount += matches;

    // Check for the IntersectionObserver script (approximate match)
    if (chunk.includes('IntersectionObserver') && chunk.includes('entry.isIntersecting')) {
        hasScript = true;
    }
});

stream.on('end', () => {
    console.log(`Reveal classes found: ${revealCount}`);
    console.log(`IntersectionObserver script found: ${hasScript}`);

    // Check the last part of the file for the script
    fs.stat(path, (err, stats) => {
        if (err) return;
        const size = stats.size;
        const buffer = Buffer.alloc(2000);
        const fd = fs.openSync(path, 'r');
        fs.readSync(fd, buffer, 0, 2000, Math.max(0, size - 2000));
        fs.closeSync(fd);
        const tail = buffer.toString('utf8');
        console.log("--- Tail of file ---");
        console.log(tail.substring(tail.lastIndexOf('<script>')));
    });
});
