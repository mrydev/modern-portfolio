// --- DATA ---
const projects = [
    { id: 1, title: "Private Residence", location: "İstanbul, Türkiye", lat: 41.0082, lon: 28.9784, category: "Residential // Glass & Concrete", image: "https://i.ibb.co/pvVMYhvn/1-1-Photo.jpg", description: "This residence explores the dialogue between transparent and opaque materials, using vast glass panes and raw concrete walls to create a space that is both open to nature and a protective sanctuary." },
    { id: 2, title: "Burhaniye Sailing Club", location: "Konya, Türkiye", lat: 37.87, lon: 32.49, category: "Public // Steel", image: "https://i.ibb.co/KchGxr3x/A3defterr-13.png", description: "A lightweight steel structure designed to be a landmark on the coastline. The project emphasizes modularity and a strong connection with the sea, reflecting the dynamism of sailing." },
    { id: 3, title: "BAUN Innovation Center", location: "İstanbul, Türkiye", lat: 41.0082, lon: 28.9784, category: "Public // Glass & Concrete", image: "https://i.ibb.co/tMS1vMtW/inno.png", description: "The innovation center is conceived as a 'concrete incubator' for ideas. Its robust, solid form provides a stable environment for creative work, while strategically placed openings foster collaboration." },
];

// --- NAVIGATION & SCROLLING LOGIC ---
function showSection(sectionId) {
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNav(activeSectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('border-white', 'text-red-500');
        link.classList.add('border-transparent');
        
        const navId = 'nav-' + activeSectionId.replace('-section', '');
        if (link.id === navId) {
            link.classList.add('border-white');
            link.classList.remove('border-transparent');
        }
    });
}

// --- PROJECT MAP & LIST LOGIC ---
function initializeProjectsSection() {
    const projectList = document.getElementById('project-list');
    const markers = {};

    // Haritayı oluştur
    var map = L.map('map').setView([39.9334, 32.8597], 5);
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        className: 'map-tiles'
    }).addTo(map);

    // Brutalist marker ikonları
    const brutalistIcon = L.divIcon({ className: 'brutalist-marker-icon', iconSize: [12, 12] });
    const highlightIcon = L.divIcon({ className: 'brutalist-marker-icon brutalist-marker-icon-highlight', iconSize: [20, 20] });

    // Projeleri listele ve haritaya pin ekle
    projects.forEach(p => {
        // Proje listesi öğesi oluştur
        const listItemHTML = `
            <img src="${p.image}" alt="${p.title}" class="w-24 h-24 object-cover border-2 border-gray-700 group-hover:border-white transition-colors duration-200 flex-shrink-0">
            <div class="flex-grow">
                <h3 class="font-brutalist font-bold text-xl group-hover:text-red-500 transition-colors duration-200">${p.title}</h3>
                <p class="font-mono-brutalist text-sm text-gray-400 mt-1">${p.category}</p>
                <p class="font-mono-brutalist text-xs text-gray-500 mt-2 hidden sm:block">${p.description.substring(0, 80)}...</p>
            </div>
        `;
        const listItem = document.createElement('a');
        listItem.href = `project-${p.id}.html`;
        listItem.className = "group bg-black p-4 flex items-start gap-4 cursor-pointer border-b-2 border-gray-800 hover:bg-gray-900 transition-colors duration-200 last:border-b-0";
        listItem.innerHTML = listItemHTML;
        projectList.appendChild(listItem);

        // Haritaya marker ekle
        const marker = L.marker([p.lat, p.lon], {icon: brutalistIcon}).addTo(map);
        markers[p.id] = marker;
        const popupContent = `
            <div class="font-mono-brutalist">
                <h3 class="font-bold uppercase">${p.title}</h3>
                <p class="text-xs text-gray-400">${p.location}</p>
                <a href="project-${p.id}.html" class="text-red-500 hover:underline block mt-2">[VIEW]</a>
            </div>
        `;
        marker.bindPopup(popupContent);

        // Etkileşimleri ekle
        listItem.addEventListener('mouseover', () => {
            marker.setIcon(highlightIcon);
        });
        listItem.addEventListener('mouseout', () => {
            marker.setIcon(brutalistIcon);
        });
        listItem.addEventListener('click', (e) => {
            e.preventDefault();
            map.flyTo([p.lat, p.lon], 8);
            marker.openPopup();

            // Mobil için haritaya scroll yap
            if (window.innerWidth < 768) { // Tailwind'in 'md' breakpoint'i
                const mapElement = document.getElementById('map');
                setTimeout(() => { // flyTo animasyonuna zaman tanımak için küçük bir gecikme
                    mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 400);
            }
        });
    });
}


// --- MOBILE MENU LOGIC ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
}

// --- SCROLL-BASED LOGIC ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            updateNav(entry.target.id);
        }
    });
}, { 
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0 
});

const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// --- TYPING SUBTITLE ANIMATION ---
const typingTextElement = document.getElementById('typing-text');
const words = ["KONSTRUKT", "DESIGN", "CONCRETE", "STRUCTURE", "FORM", "MATERIAL"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];
    const displayText = isDeleting 
        ? currentWord.substring(0, charIndex - 1)
        : currentWord.substring(0, charIndex + 1);
        
    if (typingTextElement) {
        typingTextElement.textContent = displayText;
    }
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    let typeSpeed = isDeleting ? 75 : 150;

    if (!isDeleting && displayText === currentWord) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && displayText === '') {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// --- FORM HANDLING ---
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    formFeedback.textContent = '[ SENDING... ]';

    // Simulate network request
    setTimeout(() => {
        formFeedback.textContent = '✓ MESSAGE SENT SUCCESSFULLY.';
        formFeedback.classList.add('text-green-500');
        contactForm.reset();
    }, 1500);
});

// --- INITIALIZATION & PRELOADER ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const content = document.getElementById('content');
    
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
        content.style.display = 'block';
        initializeProjectsSection(); // Haritayı burada başlat
    }, 500); // Eşleşen CSS geçiş süresi
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.section-content').forEach((section) => {
        observer.observe(section);
    });
    
    // Yazma animasyonunu başlat
    setTimeout(type, 1000);
});
