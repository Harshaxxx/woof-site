
const fs = require('fs');
const path = 'c:\\Users\\15512\\OneDrive\\Desktop\\woof-v1\\woof-site\\index.html';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. INJECT CSS
    const cssBlock = `
    <style>
        .reveal {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            transition: all 0.7s cubic-bezier(0.21, 0.47, 0.32, 0.98);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }
        .delay-400 { transition-delay: 0.4s; }
        .delay-500 { transition-delay: 0.5s; }
    </style>
    `;

    if (!content.includes('.reveal {')) {
        content = content.replace('</head>', `${cssBlock}\n</head>`);
        console.log("Injected Animation CSS.");
    }

    // 2. INJECT JS
    const jsBlock = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Toggle active class when element enters/leaves viewport
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    } else {
                        // Optional: remove class to replay animation when scrolling back up
                        entry.target.classList.remove('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: "0px"
            });

            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });
    </script>
    `;

    if (!content.includes('new IntersectionObserver')) {
        content = content.replace('</body>', `${jsBlock}\n</body>`);
        console.log("Injected Animation JS.");
    }

    // 3. APPLY CLASSES (Staggered Logic)
    // We assume the file is clean (no 'reveal' classes) initially because of the git restore.

    // a. Standard Replacements
    const standardReplacements = [
        { regex: /class="(?!(?:.*reveal))card /g, to: 'class="reveal card ' },
        { regex: /class="(?!(?:.*reveal))headline-label /g, to: 'class="reveal headline-label ' },
        { regex: /class="(?!(?:.*reveal))text-4xl /g, to: 'class="reveal text-4xl ' },
        { regex: /class="(?!(?:.*reveal))text-5xl /g, to: 'class="reveal text-5xl ' },
        { regex: /class="(?!(?:.*reveal))text-3xl /g, to: 'class="reveal text-3xl ' },
        { regex: /class="(?!(?:.*reveal))text-whhite\/70 /g, to: 'class="reveal text-white/70 ' } // Typo fix match if needed or simplify
    ];

    // Correct text-white/70 regex
    standardReplacements.push({ regex: /class="(?!(?:.*reveal))text-white\/70 /g, to: 'class="reveal text-white/70 ' });

    let appliedCount = 0;
    standardReplacements.forEach(rep => {
        const matches = content.match(rep.regex);
        if (matches) {
            appliedCount += matches.length;
            content = content.replace(rep.regex, rep.to);
        }
    });
    console.log(`Injected base 'reveal' classes to ${appliedCount} elements.`);

    // b. Stagger Delays
    const parts = content.split('class="reveal card ');
    if (parts.length > 1) {
        let newContent = parts[0];
        let delayIndex = 0;

        for (let i = 1; i < parts.length; i++) {
            // Check distance to group cards
            if (i > 1 && parts[i - 1].length < 1500) {
                delayIndex++;
            } else {
                delayIndex = 0;
            }

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
    console.log("Animation restoration complete.");

} catch (e) {
    console.error("Error:", e);
}
