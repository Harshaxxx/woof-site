
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // We look for the substring found in line 130: "Walk, connect, play, earn — in one app."
    // We will match a part of it to be safe against indentation, or split by lines.

    const lines = content.split('\n');
    let found = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Walk, connect, play, earn')) {
            console.log("Found target on line " + (i + 1));
            // Wrap the inner text
            // We want to preserve the H1/div indent but wrap the text content.
            // The line is: "          Walk, connect, play, earn — in one app."
            // We'll replace the text content part.

            const originalLine = lines[i];
            // Regex to capture the text roughly
            // Assuming it's inside tags or just text.
            // If it is just text inside H1 tags on previous/next lines?
            // From inspect output: Line 130 is just the text (indented).

            const textToWrap = "Walk, connect, play, earn — in one app.";
            if (originalLine.includes(textToWrap)) {
                const replacementSpan = `<span class="inline-block transition-transform duration-300 hover:scale-105 cursor-default">${textToWrap}</span>`;
                lines[i] = originalLine.replace(textToWrap, replacementSpan);
                found = true;
                break; // Assuming only one occurrence we want to change
            }
        }
    }

    if (found) {
        fs.writeFileSync(path, lines.join('\n'), 'utf8');
        console.log("Successfully applied hover effect.");
    } else {
        console.log("Could not match exact text to replace.");
    }

} catch (e) {
    console.error("Error:", e);
}
