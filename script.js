// --- CONFIGURATION ---
const container = document.querySelector('.scroll-container');
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const counter = document.querySelector('.progress-counter');
const panels = document.querySelectorAll('.panel');

// --- SPEED SETTINGS ---
let current = 0;
let target = 0;
let ease = 0.07;   // Slightly heavier for a cinematic feel
let speed = 3.5;   // Your preferred speed

// 1. SCROLL
window.addEventListener('wheel', (e) => {
    target += e.deltaY * speed;
    let maxScroll = container.scrollWidth - window.innerWidth;
    target = Math.max(0, target);
    target = Math.min(target, maxScroll);
});

// 2. ANIMATION LOOP
function animate() {
    current += (target - current) * ease;
    container.style.transform = `translateX(-${current}px)`;
    updateCounter();
    requestAnimationFrame(animate);
}
animate();

// 3. COUNTER (01 / 05)
function updateCounter() {
    // Center of the screen
    const center = current + window.innerWidth / 2;
    let index = 0;
    let widthSum = 0;

    panels.forEach((panel, i) => {
        if (center > widthSum && center < widthSum + panel.offsetWidth) {
            index = i + 1;
        }
        widthSum += panel.offsetWidth;
    });

    counter.innerHTML = `0${index} <span class="divider">/</span> 0${panels.length}`;
}

// 4. MAGNETIC CURSOR
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
});

// Hover effect on interactive elements
const hoverables = document.querySelectorAll('a, .skill-item, .project-img');

hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0)';
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.backgroundColor = 'white';
        follower.style.mixBlendMode = 'difference';
        follower.style.border = 'none';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.backgroundColor = 'transparent';
        follower.style.mixBlendMode = 'normal';
        follower.style.border = '1px solid rgba(255,255,255,0.3)';
    });
});