
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // Find the first img tag (Header Logo)
    const imgTagRegex = /<img[^>]*>/;
    const match = content.match(imgTagRegex);

    if (match) {
        let imgTag = match[0];
        console.log("Found header logo tag (partial):", imgTag.substring(0, 100) + "...");

        // Check if it already has h-10 w-10
        if (imgTag.includes('h-10 w-10')) {
            console.log("Header logo is already sized correctly.");
        } else {
            console.log("Header logo needs resizing.");

            // If it has a class attribute, append sizing
            if (imgTag.includes('class="')) {
                const newImgTag = imgTag.replace('class="', 'class="h-10 w-10 object-contain ');
                content = content.replace(imgTag, newImgTag);
            } else {
                // If no class attribute, add one after <img
                const newImgTag = imgTag.replace('<img', '<img class="h-10 w-10 object-contain"');
                content = content.replace(imgTag, newImgTag);
            }

            fs.writeFileSync(path, content, 'utf8');
            console.log("Updated header logo size.");
        }
    } else {
        console.log("No img tag found in the beginning of the file.");
    }

} catch (e) {
    console.error("Error:", e);
}
