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

// --- DATA FOR DETAILS (Contenu de "En savoir plus") ---
const projectsData = {
    "questionary": {
        title: "QUESTIONARY GENERATOR",
        tags: "WEB APP • JS • HTML",
        content: [
            {
                img: "assets/questionary.png",
                title: "User Interface",
                text: "A clean web application built for IUT Limoges. It allows users to easily create questionnaires with various input types (text, multiple choice, gauges)."
            },
            {
                img: "assets/questionary.png", // Tu pourras mettre une autre image ici
                title: "Logic & Validation",
                text: "Implemented conditional logic to show/hide questions based on previous answers. Includes robust client-side validation and result aggregation."
            }
        ]
    },
    "latice": {
        title: "LATICE BOARD GAME",
        tags: "JAVA • JAVAFX • MVC",
        content: [
            {
                img: "assets/latice.png",
                title: "Game Development",
                text: "Led the front-end development using JavaFX. The game implements complex rules of the Haitian board game 'Latice'."
            },
            {
                img: "assets/latice.png",
                title: "Quality Assurance",
                text: "Focus on code quality with JUnit and Mockito for unit testing, ensuring the logic is bug-free and reliable."
            }
        ]
    },
    "network": {
        title: "NETWORK ARCHITECTURE",
        tags: "CISCO • LINUX • SYSADMIN",
        content: [
            {
                img: "assets/network.png",
                title: "Infrastructure Design",
                text: "Designed a multi-zone network architecture including Servers, Staff, and Clients zones. Configured routing protocols and VLANs."
            },
            {
                img: "assets/network.png",
                title: "Services Implementation",
                text: "Deployed critical services such as DHCP for IP management, DNS, and Apache web servers on Linux environments (Debian/Arch)."
            }
        ]
    },
    "ecommerce": {
        title: "E-COMMERCE PLATFORM",
        tags: "PHP • SQL • HTML/CSS",
        content: [
            {
                img: "assets/ecommerce.png",
                title: "Fullstack Development",
                text: "Built a complete online store from scratch. Features include a dynamic product catalog, user authentication, and a shopping cart system."
            },
            {
                img: "assets/ecommerce.png",
                title: "Business Logic",
                text: "Integrated a payment simulation system and an admin panel to manage products and orders. The project focuses on security and data integrity."
            }
        ]
    },
    "minigames": {
        title: "CONSOLE MINI-GAMES",
        tags: "PYTHON • ALGORITHMS",
        content: [
            {
                img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop",
                title: "Modular Design",
                text: "Developed a suite of mini-games running in the console. Focused on structured programming and code reusability."
            }
        ]
    }
};

// 1. SCROLL HORIZONTAL
window.addEventListener('wheel', (e) => {
    // Si l'overlay est ouvert, on ne scroll pas horizontalement
    if(document.getElementById('detail-overlay').classList.contains('open')) return;

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

const hoverables = document.querySelectorAll('a, .skill-item, .project-img, button');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0)';
        follower.style.width = '50px';
        follower.style.height = '50px';
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

// 5. LOGIQUE DU DETAIL OVERLAY
const overlay = document.getElementById('detail-overlay');
const closeBtn = document.getElementById('close-detail');
const detailContent = document.getElementById('detail-content');
const btnsMore = document.querySelectorAll('.btn-more');

btnsMore.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const data = projectsData[id];
        if(data) {
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
            overlay.classList.add('open');
            // Affiche la croix seulement quand l'overlay est ouvert
            closeBtn.classList.add('visible');
        }
    });
});

closeBtn.addEventListener('click', () => {
    overlay.classList.remove('open');
    // Masque la croix quand on ferme l'overlay
    closeBtn.classList.remove('visible');
});