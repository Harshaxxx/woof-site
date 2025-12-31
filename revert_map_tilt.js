
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Remove the CSS class from the image tag
    // Looking for class="hover-tilt-30 " or "hover-tilt-30" inside the image tag.
    // The previous script likely added 'hover-tilt-30 ' to the class attribute.

    // We look for the map image context again to be safe
    const targetSection = '<div class="reveal card p-0 overflow-hidden h-fit">';
    const imgStart = '<img';

    let sectionIndex = content.indexOf(targetSection);
    if (sectionIndex !== -1) {
        let imgIndex = content.indexOf(imgStart, sectionIndex);
        if (imgIndex !== -1) {
            let imgTagEnd = content.indexOf('>', imgIndex);
            let imgTag = content.substring(imgIndex, imgTagEnd + 1);

            if (imgTag.includes('hover-tilt-30')) {
                let newImgTag = imgTag.replace('hover-tilt-30 ', '').replace('hover-tilt-30', '');
                // Clean up double spaces if any
                newImgTag = newImgTag.replace('class="  ', 'class="').replace('  ', ' ');

                content = content.substring(0, imgIndex) + newImgTag + content.substring(imgTagEnd + 1);
                console.log("Removed hover-tilt-30 class from image.");
            } else {
                console.log("hover-tilt-30 class not found on image.");
            }
        }
    }

    // 2. Remove the style block
    const styleBlockStart = '<style>\n.hover-tilt-30 {';
    // The previous script added a specific style block. 
    // We should look for the content and remove the whole style block if it matches our custom one.
    // Or just use regex to remove the specific css rules if they were appended to an existing block (unlikely based on my prev script).
    // My previous script added:
    /*
<style>
.hover-tilt-30 {
    transition: transform 0.5s ease;
}
.hover-tilt-30:hover {
    transform: rotate(30deg);
}
</style>
    */

    // We will use a regex to match this block more robustly, handling potential whitespace diffs
    const styleRegex = /<style>\s*\.hover-tilt-30\s*\{[\s\S]*?\}\s*\.hover-tilt-30:hover\s*\{[\s\S]*?\}\s*<\/style>/;

    if (styleRegex.test(content)) {
        content = content.replace(styleRegex, '');
        console.log("Removed hover-tilt-30 style block.");
    } else {
        console.log("Style block not found (regex mismatch). Checking likely exact string.");
        // Fallback to exact string match check from previous script
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
        if (content.includes(styleTag.trim())) {
            content = content.replace(styleTag.trim(), '');
            console.log("Removed hover-tilt-30 style block (exact match).");
        }
    }

    // Clean up empty lines left behind if necessary (optional)

    fs.writeFileSync(path, content, 'utf8');

} catch (e) {
    console.error(e);
}
