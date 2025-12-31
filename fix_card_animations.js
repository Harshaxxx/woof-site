
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Fix missed cards (class="card") -> class="reveal card"
    // Regex matches class="card" where " follows immediately
    let countValues = 0;

    // We want to turn <div class="card"> into <div class="reveal card">
    // and also <div class="card other"> into <div class="reveal card other"> (which was handled if space existed)

    content = content.replace(/class="card"/g, (match) => {
        countValues++;
        return 'class="reveal card"';
    });
    console.log(`Fixed ${countValues} strict 'class="card"' instances.`);

    // 2. Re-apply staggered delays logic
    // We can reuse the logic from before, but let's make it robust.
    // We'll look for all "reveal card" instances now.

    // Reset any existing delays to avoid duplicates if we run this again? 
    // Regex to remove " delay-100", " delay-200" etc from card classes?
    content = content.replace(/ delay-\d+/g, '');

    const parts = content.split('class="reveal card'); // Split by the common prefix
    // Note: the quote " might be at the start of the next part, or a space then other classes.

    if (parts.length > 1) {
        let newContent = parts[0];
        let delayIndex = 0;

        for (let i = 1; i < parts.length; i++) {
            // Check distance
            if (i > 1 && parts[i - 1].length < 1500) {
                delayIndex++;
            } else {
                delayIndex = 0;
            }

            const actualDelay = Math.min(delayIndex * 100, 500);

            const prefix = 'class="reveal card';
            let suffix = '';

            if (actualDelay > 0) {
                suffix = ` delay-${actualDelay}`;
            }

            newContent += prefix + suffix + parts[i];
        }
        content = newContent;
        console.log("Re-applied stagger delays to all cards.");
    }

    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated index.html with fixed animations.");

} catch (e) {
    console.error("Error modifying file:", e);
}
