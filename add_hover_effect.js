
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Pattern to find: The text inside the h1
    // We look for "Walk, play &amp; earn in one app"
    // We will replace it with the span version.

    const targetText = 'Walk, play &amp; earn in one app';
    const replacementText = '<span class="inline-block transition-transform duration-300 hover:scale-105 cursor-default">Walk, play &amp; earn in one app</span>';

    if (content.includes(targetText)) {
        // Check if already wrapped to avoid double wrapping
        if (content.includes('hover:scale-105 cursor-default">Walk, play')) {
            console.log("Text already has hover effect.");
        } else {
            // Replace the first occurrence appropriately (it should be the H1)
            // Or use a more specific regex if needed.
            // Given the file structure, this unique string is likely the H1.

            const newContent = content.replace(targetText, replacementText);
            fs.writeFileSync(path, newContent, 'utf8');
            console.log("Successfully added hover effect to text.");
        }
    } else {
        console.log("Target text not found: " + targetText);
        // Try without &amp; just in case
        const altTarget = 'Walk, play & earn in one app';
        if (content.includes(altTarget)) {
            const newContent = content.replace(altTarget, replacementText);
            fs.writeFileSync(path, newContent, 'utf8');
            console.log("Successfully added hover effect to text (matched &).");
        }
    }

} catch (e) {
    console.error("Error:", e);
}
