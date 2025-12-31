
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Increase Logo Size
    // Target both header and footer logos if they share the alt attribute
    // Regex for logo: look for alt="Woof logo" and then modify the h-6 w-6 in its class list
    // Since attributes can be in any order, we handle the class attribute specifically.

    // We'll replace 'h-6 w-6' with 'h-10 w-10' ONLY if it's near 'Woof logo' or is the specific logo class string.
    // Simpler: Replace established logo class string if unique match
    // Header typically: class="h-6 w-6 rounded-md ...

    // Strategy: Search for the specific string identifying the logo tag chunks and replace size classes within them.
    // Or just global replace of "alt=\"Woof logo\" class=\"h-6 w-6" -> "alt=\"Woof logo\" class=\"h-12 w-12"

    // Let's rely on the previous finding that line 682 had explicit 'class="h-6 w-6'. 
    // We'll try to catch the header one too.

    // Global replacement for specific logo classes
    content = content.replace(/class="h-6 w-6 rounded-md ring-1 ring-white\/10 bg-\[#FFD84D\] object-contain"/g,
        'class="h-10 w-10 rounded-md ring-1 ring-white/10 bg-[#FFD84D] object-contain"');

    // 2. Increase Feature Icons Size
    // "shrink-0 h-10 w-10 rounded-2xl" -> "shrink-0 h-14 w-14 rounded-2xl"
    content = content.replace(/shrink-0 h-10 w-10 rounded-2xl/g, 'shrink-0 h-14 w-14 rounded-2xl');

    // 3. Increase Text Sizes (Typography Scale)
    // Mapping current -> larger

    const textUpgrades = [
        { from: /text-5xl/g, to: 'text-6xl' },
        { from: /text-4xl/g, to: 'text-5xl' },
        { from: /text-3xl/g, to: 'text-4xl' },
        { from: /text-2xl/g, to: 'text-3xl' },
        { from: /text-xl/g, to: 'text-2xl' },
        { from: /text-lg/g, to: 'text-xl' },
        { from: /text-base/g, to: 'text-lg' },
        { from: /text-sm/g, to: 'text-base' },
        { from: /text-xs/g, to: 'text-sm' },
        { from: /text-\[14px\]/g, to: 'text-base' },
        { from: /text-\[13px\]/g, to: 'text-sm' },
        { from: /text-\[12px\]/g, to: 'text-sm' },
    ];

    // We must apply these carefully. "text-xl" contains "text-xl", but regex boundaries help. 
    // Also we must treat this as a single pass or use unique placeholders to avoid cascading upgrades.
    // E.g. simply replacing text-sm -> text-base, then later text-base -> text-lg means text-sm becomes text-lg.

    // Solution: Parse all "text-..." classes, look them up in a map, and replace.
    // Regex to find any text class: /text-(?:\[\d+px\]|xs|sm|base|lg|xl|\d+xl)/g

    const sizeMap = {
        'text-6xl': 'text-7xl',
        'text-5xl': 'text-6xl',
        'text-4xl': 'text-5xl',
        'text-3xl': 'text-4xl',
        'text-2xl': 'text-3xl',
        'text-xl': 'text-2xl',
        'text-lg': 'text-xl',
        'text-base': 'text-lg',
        'text-sm': 'text-base',
        'text-xs': 'text-sm',
        'text-[14px]': 'text-base',
        'text-[13px]': 'text-sm',
        'text-[12px]': 'text-sm',
        'text-[10px]': 'text-xs'
    };

    content = content.replace(/text-(?:\[\d+px\]|xs|sm|base|lg|xl|\d+xl)/g, (match) => {
        if (sizeMap[match]) {
            return sizeMap[match];
        }
        return match; // Return original if not in map (e.g. text-center is not matched by this regex anyway)
    });

    // 4. Also upgrade specific font-weights or leading if necessary?
    // User just said "text size", "image size", "logo size".
    // We are good.

    fs.writeFileSync(path, content, 'utf8');
    console.log("Scaled up logo, icons, and text sizes.");

} catch (e) {
    console.error("Error updating sizes:", e);
}
