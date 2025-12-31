
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // defined replacements using regex with global flag to replace ALL occurrences
    const replacements = [
        { from: /class="card /g, to: 'class="reveal card ' },
        { from: /class="headline-label /g, to: 'class="reveal headline-label ' },
        { from: /class="text-4xl /g, to: 'class="reveal text-4xl ' },
        { from: /class="text-5xl /g, to: 'class="reveal text-5xl ' },
        { from: /class="text-3xl /g, to: 'class="reveal text-3xl ' }, // Covering more sizes
        { from: /class="text-2xl /g, to: 'class="reveal text-2xl ' },
        { from: /class="text-white\/70 /g, to: 'class="reveal text-white/70 ' }
    ];

    let count = 0;
    replacements.forEach(rep => {
        // We do a check to see if we aren't accidentally double-tagging if this matches the "to" pattern
        // But simple text replacement specific to the starts of strings is safer.
        // We assume the existing file does NOT have "reveal" yet (checked in previous step).

        // Count matches for logging
        const matches = content.match(rep.from);
        if (matches) {
            count += matches.length;
            content = content.replace(rep.from, rep.to);
        }
    });

    fs.writeFileSync(path, content, 'utf8');
    console.log(`Successfully injected 'reveal' class into ${count} elements.`);

} catch (e) {
    console.error("Error modifying file:", e);
}
