// LENIS SMOOTH SCROLL INITIALIZATION
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP Registering
gsap.registerPlugin(ScrollTrigger);

// HEADER ANIMATION ON SCROLL
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// HERO TITLE ANIMATION
if (document.getElementById("hero-title")) {
    gsap.to("#hero-title", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.5
    });
}

// SLOGAN REVEAL ANIMATION
if (document.querySelector(".slogan-reveal")) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".slogan-reveal",
            start: "top 80%",
            end: "top 20%",
            scrub: true,
        }
    });

    tl.to("#reveal-text", {
        opacity: 1,
        y: -20,
        duration: 1
    })
    .to("#reveal-btn-wrap", {
        opacity: 1,
        y: 0,
        duration: 0.5
    }, "-=0.5");
}

// QUICK-WIN CARDS ANIMATION
gsap.utils.toArray('.card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power2.out"
    });
});

// MAGNETIC BUTTON EFFECT
const magneticBtns = document.querySelectorAll('.btn-flow');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const bounds = btn.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left - bounds.width / 2;
        const mouseY = e.clientY - bounds.top - bounds.height / 2;
        
        gsap.to(btn, {
            x: mouseX * 0.35,
            y: mouseY * 0.35,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// MOBILE MENU (SIMPLE ORBIT CONCEPT)
const mobileToggle = document.getElementById('mobile-toggle');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        // Just a placeholder for the circle Orbit menu
        console.log("MOBILE MENU ORBIT TIGERED");
        alert("Mobile Orbit Menu coming soon - 2026 Style!");
    });
}

// PANEL CLOSE LOGIC
const panel = document.getElementById('body-info-panel');
const closeBtn = document.getElementById('close-panel');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        panel.classList.remove('active');
    });
}

// PARTICLE BACKGROUND SYSTEM
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas ? pCanvas.getContext('2d') : null;
let particles = [];

function resizePartCanvas() {
    if (pCanvas) {
        pCanvas.width = window.innerWidth;
        pCanvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizePartCanvas);
resizePartCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * (pCanvas ? pCanvas.width : 0);
        this.y = Math.random() * (pCanvas ? pCanvas.height : 0);
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (pCanvas) {
            if (this.x > pCanvas.width) this.x = 0;
            if (this.x < 0) this.x = pCanvas.width;
            if (this.y > pCanvas.height) this.y = 0;
            if (this.y < 0) this.y = pCanvas.height;
        }
    }
    
    draw() {
        if (!pCtx) return;
        pCtx.fillStyle = `rgba(0, 229, 201, ${this.opacity})`;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
    }
}

// WAVE BACKGROUND SYSTEM
const wCanvas = document.getElementById('bg-wave-canvas');
const wCtx = wCanvas ? wCanvas.getContext('2d') : null;
let wTime = 0;

function resizeWaveCanvas() {
    if (wCanvas) {
        wCanvas.width = window.innerWidth;
        wCanvas.height = window.innerHeight;
    }
}
window.addEventListener('resize', resizeWaveCanvas);
resizeWaveCanvas();

function drawWave() {
    if (!wCtx || !wCanvas) return;
    wCtx.clearRect(0, 0, wCanvas.width, wCanvas.height);
    
    wCtx.strokeStyle = '#6B4F3A';
    wCtx.lineWidth = 1;
    wCtx.beginPath();
    
    const waves = 3;
    for(let j = 0; j < waves; j++) {
        const offset = j * 100;
        for(let i = 0; i < wCanvas.width; i+=2) {
            const x = i;
            const y = wCanvas.height/2 + 
                      Math.sin(i * 0.005 + wTime + j) * 80 + 
                      Math.sin(i * 0.002 + wTime * 0.5) * 40;
            
            if(i === 0) wCtx.moveTo(x, y + offset - (waves * 50));
            else wCtx.lineTo(x, y + offset - (waves * 50));
        }
    }
    wCtx.stroke();
    wTime += 0.01;
}

function animateBackgrounds() {
    if (pCtx && pCanvas) {
        pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
    }
    drawWave();
    requestAnimationFrame(animateBackgrounds);
}

initParticles();
animateBackgrounds();
