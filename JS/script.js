// --- CONFIGURATION ---
const container = document.querySelector('.scroll-container');
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const counter = document.querySelector('.progress-counter');
const panels = document.querySelectorAll('.panel');

// --- SPEED SETTINGS ---
let current = 0;
let target = 0;
let ease = 0.07;
let speed = 3.5;

// Translations are now in translations.js
let currentLang = 'en';

// Projects data is now in projects.js
// 1. SCROLL HORIZONTAL
window.addEventListener('wheel', (e) => {
    if (document.getElementById('detail-overlay').classList.contains('open')) return;
    target += (e.deltaY + e.deltaX) * speed;
    let maxScroll = container.scrollWidth - window.innerWidth;
    target = Math.max(0, target);
    target = Math.min(target, maxScroll);
});

window.addEventListener('keydown', (e) => {
    if (document.getElementById('detail-overlay').classList.contains('open')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target += 100 * speed;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target -= 100 * speed;
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

// 3. COUNTER
function updateCounter() {
    const center = current + window.innerWidth / 2;
    let index = 0;
    let widthSum = 0;
    panels.forEach((panel, i) => {
        if (center > widthSum && center < widthSum + panel.offsetWidth) index = i + 1;
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

document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, .skill-item, .project-img, button, .lang-btn, .tech-link')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(0)';
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.backgroundColor = 'white';
        follower.style.mixBlendMode = 'difference';
        follower.style.border = 'none';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, .skill-item, .project-img, button, .lang-btn, .tech-link')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.backgroundColor = 'transparent';
        follower.style.mixBlendMode = 'normal';
        follower.style.border = '1px solid rgba(255,255,255,0.3)';
    }
});

// 5. LOGIQUE DU DETAIL OVERLAY
const overlay = document.getElementById('detail-overlay');
const closeBtn = document.getElementById('close-detail');
const detailContent = document.getElementById('detail-content');
const btnsMore = document.querySelectorAll('.btn-more');

function renderOverlayContent(id) {
    const data = projectsData[id] && projectsData[id][currentLang];
    if (data) {
        let html = `
            <div class="detail-header">
                <div class="tags">${data.tags}</div>
                <h1>${data.title}</h1>
            </div>`;

        data.content.forEach((row, index) => {
            const rev = index % 2 !== 0 ? 'reverse' : '';
            html += `
                <div class="detail-row ${rev}">
                    <div class="detail-visual"><img src="${row.img}" class="detail-img"></div>
                    <div class="detail-text"><h3>${row.title}</h3><p>${row.text}</p></div>
                </div>`;
        });

        detailContent.innerHTML = html;
        detailContent.setAttribute('data-current-id', id);
    }
}

btnsMore.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        renderOverlayContent(id);
        overlay.classList.add('open');
        closeBtn.classList.add('visible');
    });
});

closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    closeBtn.classList.remove('visible');
});

// --- LOGIQUE DE TRADUCTION ---
const langBtns = document.querySelectorAll('.lang-btn');
langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        if (lang) setLanguage(lang);
    });
});

function setLanguage(lang) {
    currentLang = lang;
    
    // Update active class on buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update translations for common UI elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update overlay if open
    const id = detailContent.getAttribute('data-current-id');
    if (id && overlay.classList.contains('open')) {
        renderOverlayContent(id);
    }
}

// Initialization : load EN by default
setLanguage('en');