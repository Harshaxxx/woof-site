
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Target the RIGHT: MAP PREVIEW section
    // We look for the comment and the following div structure
    const targetSection = /<!-- RIGHT: MAP PREVIEW -->\s*<div[^>]*>\s*<div[^>]*>\s*<img[^>]*>/;

    // We want to replace the inner content of the map preview card div with our new grid.
    // The structure is:
    // <!-- RIGHT: MAP PREVIEW -->
    // <div class="reveal card p-0 overflow-hidden">
    //   <div class="rounded-2xl overflow-hidden bg-black/40 border border-white/10">
    //     <img ... >
    //   </div>
    // </div>

    // Let's replace the whole inner part including the IMG tag.

    const startMarker = '<!-- RIGHT: MAP PREVIEW -->';
    const startIndex = content.indexOf(startMarker);

    if (startIndex !== -1) {
        console.log("Found Map Preview section.");
        // Find the closing div of this section is tricky without parsing, 
        // but we know it contains a huge base64 img.
        // Let's find the closing </div> for the image container multiple times?
        // Actually, we can just replace the <img ...> tag specifically inside this section.

        // Find the img tag after the marker
        const imgTagStart = content.indexOf('<img', startIndex);
        const imgTagEnd = content.indexOf('>', imgTagStart);

        if (imgTagStart !== -1 && imgTagEnd !== -1) {
            const imgTag = content.substring(imgTagStart, imgTagEnd + 1);

            // New HTML: 3 images side by side
            // We'll wrap them in a flex or grid container
            const newHtml = `
            <div class="grid grid-cols-3 gap-2 p-4 bg-black/20">
                <div class="group relative">
                    <img src="./images/map_step_1.png" class="w-full rounded-lg shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-105" alt="Map Step 1">
                    <div class="mt-2 text-center text-xs font-medium text-white/70">1. Find</div>
                </div>
                <div class="group relative">
                    <img src="./images/map_step_2.png" class="w-full rounded-lg shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-105" alt="Map Step 2">
                    <div class="mt-2 text-center text-xs font-medium text-white/70">2. Track</div>
                </div>
                <div class="group relative">
                    <img src="./images/map_step_3.png" class="w-full rounded-lg shadow-lg ring-1 ring-white/10 transition-transform group-hover:scale-105" alt="Map Step 3">
                    <div class="mt-2 text-center text-xs font-medium text-white/70">3. Earn</div>
                </div>
            </div>`;

            // Reconstruct the file content
            // We replace the IMG tag with our New HTML. 
            // Note: The previous img was inside a div with bg-black/40. 
            // We might want to keep or adjust that wrapper. 
            // The replace logic below puts the grid INSIDE the existing wrapper (div.rounded-2xl...).

            const newContent = content.substring(0, imgTagStart) + newHtml + content.substring(imgTagEnd + 1);

            fs.writeFileSync(path, newContent, 'utf8');
            console.log("Replaced Map Preview image with story grid.");
        } else {
            console.log("Could not isolate the image tag.");
        }
    } else {
        console.log("Could not find the 'RIGHT: MAP PREVIEW' marker.");
    }

} catch (e) {
    console.error("Error:", e);
}
