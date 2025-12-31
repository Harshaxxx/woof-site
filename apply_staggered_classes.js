
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Reset standard reveals (avoid double injection if run multiple times)
    // We strictly check if "reveal" is NOT there before adding it, or just use regex to clean up first?
    // Simpler: assume we run this on the result of the previous step or clean file. 
    // To be safe, let's look for `class="card ` and if it doesn't have reveal, add it.

    // Standard replacements
    const standardReplacements = [
        { regex: /class="(?!(?:.*reveal))card /g, to: 'class="reveal card ', type: 'Card' },
        { regex: /class="(?!(?:.*reveal))headline-label /g, to: 'class="reveal headline-label ', type: 'Label' },
        { regex: /class="(?!(?:.*reveal))text-([2-5]xl) /g, to: 'class="reveal text-$1 ', type: 'Heading' },
        // Partners section logo images often don't have these classes, but let's check generic img in some containers?
        // For now sticking to the explicitly requested types.
    ];

    let count = 0;
    standardReplacements.forEach(rep => {
        const matches = content.match(rep.regex);
        if (matches) {
            count += matches.length;
            content = content.replace(rep.regex, rep.to);
        }
    });
    console.log(`Injected base 'reveal' classes: ${count}`);

    // 2. Add Stagger Delays to Groups of Cards
    // We look for patterns where multiple cards appear close to each other or in a list.
    // Since we are doing string replacement, we can iterate through the file string.

    // Strategy: Split by "reveal card" occurences. 
    // If the distance between them is small (e.g. < 500 chars), increment delay.
    // Reset delay if distance is large.

    const parts = content.split('class="reveal card ');
    if (parts.length > 1) {
        let newContent = parts[0];
        let delayIndex = 0;

        for (let i = 1; i < parts.length; i++) {
            const prevPart = parts[i - 1];
            // Check distance from previous card end (approximate)
            // Actually parts[i-1] IS the content between. 
            // If parts[i-1] is short, it means they are close.

            // Heuristic: adjacent cards in a grid usually have just </div></div><div...> between them.
            // If length < 1000 chars, consider it same group.

            if (i > 1 && parts[i - 1].length < 1500) {
                delayIndex++;
            } else {
                delayIndex = 0; // Reset for new section
            }

            // Cap delay at 500 to avoid waiting too long
            const actualDelay = Math.min(delayIndex * 100, 500);

            let className = `class="reveal card `;
            if (actualDelay > 0) {
                className = `class="reveal card delay-${actualDelay} `;
            }

            newContent += className + parts[i];
        }
        content = newContent;
        console.log("Applied stagger delays to cards.");
    }

    fs.writeFileSync(path, content, 'utf8');
    console.log("Successfully updated index.html with dynamic animations.");

} catch (e) {
    console.error("Error modifying file:", e);
}
