
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. REVERT HERO SECTION
    // Logic: Find the "RIGHT: MAP PREVIEW" marker and replacing the grid I added with a single image.
    const heroMarker = '<!-- RIGHT: MAP PREVIEW -->';
    const heroIndex = content.indexOf(heroMarker);
    if (heroIndex !== -1) {
        // Find the grid container I inserted previously
        // It started with <div class="grid grid-cols-3
        // And ended with </div> (closing the inner div)
        // Since I replaced the <img> tag BUT wrapped it in the existing container, it should be inside.
        // Let's look for the <div class="grid grid-cols-3... inside the Hero section.

        const heroSectionStart = heroIndex;
        // Limit search to next 1000 chars to avoid false matches
        const heroSectionSegment = content.substring(heroSectionStart, heroSectionStart + 2000);

        const gridStart = heroSectionSegment.indexOf('<div class="grid grid-cols-3');
        if (gridStart !== -1) {
            // Find the end of this div. It has 3 children divs inside.
            // Counting divs is safer.
            let depth = 0;
            let gridEnd = -1;
            const segmentFromGrid = heroSectionSegment.substring(gridStart);

            // Simple approach: find the closure of this specific grid div.
            // It has nested divs? Yes.
            // <div class="grid ..."> (depth 1)
            //   <div>...</div> (depth 1 -> 2 -> 1)
            //   <div>...</div>
            //   <div>...</div>
            // </div> (depth 0)

            let currentPos = 0;
            while (currentPos < segmentFromGrid.length) {
                const open = segmentFromGrid.indexOf('<div', currentPos);
                const close = segmentFromGrid.indexOf('</div>', currentPos);

                if (open === -1 && close === -1) break;

                if (open !== -1 && (open < close || close === -1)) {
                    depth++;
                    currentPos = open + 4;
                } else {
                    depth--;
                    currentPos = close + 6;
                }

                if (depth === 0) {
                    gridEnd = currentPos;
                    break;
                }
            }

            if (gridEnd !== -1) {
                // Construct replacement: A single image tag
                const singleImageHtml = `<img src="./images/map_step_1.png" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt="Woof Map Preview">`;

                // Perform replacement in the original content
                // Calculate absolute positions
                const absStart = heroSectionStart + gridStart;
                const absEnd = heroSectionStart + gridStart + gridEnd;

                content = content.substring(0, absStart) + singleImageHtml + content.substring(absEnd);
                console.log("Reverted Hero section to single image.");
            } else {
                console.log("Could not find end of grid in Hero section.");
            }
        } else {
            console.log("Grid not found in Hero section (already reverted?).");
        }
    }

    // 2. UPDATE WOOF MAP SECTION
    // Logic: Find "<!-- MAP PREVIEW AGAIN -->" and replace the img tag with horizontal scroll container.
    const mapMarker = '<!-- MAP PREVIEW AGAIN -->';
    const mapIndex = content.indexOf(mapMarker);

    if (mapIndex !== -1) {
        // Find the img tag inside this section
        const imgStart = content.indexOf('<img', mapIndex);
        const imgEnd = content.indexOf('>', imgStart);

        if (imgStart !== -1 && imgEnd !== -1) {
            // New Horizontal Scroll HTML
            const scrollHtml = `
            <div class="flex overflow-x-auto snap-x snap-mandatory gap-4 p-4 scrollbar-hide">
                <!-- Step 1 -->
                <div class="snap-center shrink-0 w-[85%] sm:w-[70%]">
                    <img src="./images/map_step_1.png" class="w-full rounded-xl shadow-lg border border-white/10" alt="Map Find">
                    <p class="text-center mt-3 text-sm font-medium text-white/70">1. Find Zones</p>
                </div>
                <!-- Step 2 -->
                <div class="snap-center shrink-0 w-[85%] sm:w-[70%]">
                    <img src="./images/map_step_2.png" class="w-full rounded-xl shadow-lg border border-white/10" alt="Map Track">
                    <p class="text-center mt-3 text-sm font-medium text-white/70">2. Track Route</p>
                </div>
                <!-- Step 3 -->
                <div class="snap-center shrink-0 w-[85%] sm:w-[70%]">
                    <img src="./images/map_step_3.png" class="w-full rounded-xl shadow-lg border border-white/10" alt="Map Earn">
                    <p class="text-center mt-3 text-sm font-medium text-white/70">3. Earn Rewards</p>
                </div>
            </div>`;

            content = content.substring(0, imgStart) + scrollHtml + content.substring(imgEnd + 1);
            console.log("Updated Woof Map section with horizontal scroll.");
        } else {
            console.log("Could not find img tag in Woof Map section.");
        }
    } else {
        console.log("Could not find 'MAP PREVIEW AGAIN' marker.");
    }

    fs.writeFileSync(path, content, 'utf8');

} catch (e) {
    console.error("Error:", e);
}
