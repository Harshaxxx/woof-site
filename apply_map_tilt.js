
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Inject CSS for 30 degree tilt if not present
    if (!content.includes('.hover-tilt-30')) {
        const styleTag = `
<style>
.hover-tilt-30 {
    transition: transform 0.5s ease;
}
.hover-tilt-30:hover {
    transform: rotate(30deg);
}
</style>
`;
        content = content.replace('</head>', `${styleTag}\n</head>`);
    }

    // 2. Apply class to the Map image (line ~248)
    // We look for the map image in the "MAP PREVIEW AGAIN" section.
    // It's inside <div class="reveal card p-0 overflow-hidden h-fit"> ...

    // Regex for the image tag with base64 src to be sure (approximate match)
    // Or searching for the context.

    // Context:
    // <div class="reveal card p-0 overflow-hidden h-fit">
    //   <div class="rounded-2xl overflow-hidden bg-black/40 border border-white/10">
    //     <img

    const targetSection = '<div class="reveal card p-0 overflow-hidden h-fit">';
    const imgStart = '<img';

    let sectionIndex = content.indexOf(targetSection);
    if (sectionIndex !== -1) {
        // Find the next img tag after this section start
        let imgIndex = content.indexOf(imgStart, sectionIndex);
        if (imgIndex !== -1) {
            // Check if class already exists
            let imgTagEnd = content.indexOf('>', imgIndex);
            let imgTag = content.substring(imgIndex, imgTagEnd + 1);

            if (!imgTag.includes('hover-tilt-30')) {
                // Add class. If class attribute exists, append. Else create.
                if (imgTag.includes('class="')) {
                    imgTag = imgTag.replace('class="', 'class="hover-tilt-30 ');
                } else {
                    imgTag = imgTag.replace('<img', '<img class="hover-tilt-30"');
                }

                content = content.substring(0, imgIndex) + imgTag + content.substring(imgTagEnd + 1);
                console.log("Applied tilt class to Map Image.");
            } else {
                console.log("Tilt class already present.");
            }
        } else {
            console.log("Could not find img tag in map section.");
        }
    } else {
        console.log("Could not find Map Section container.");
    }

    fs.writeFileSync(path, content, 'utf8');

} catch (e) {
    console.error(e);
}
