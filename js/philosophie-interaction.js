/**
 * HARMONY FLOW 2026 - PHILOSOPHIE INTERACTIVE GRAPHICS (BULLETPROOF STANDALONE)
 * Works without a server, without GSAP, and without Three.js if needed.
 */

const initPhiloInteraction = () => {
    console.log("Harmony Flow Interaction initializing...");

    // --- 1. GSAP SAFE WRAPPER ---
    const useGSAP = typeof gsap !== 'undefined';
    
    // SVG PATH SCROLL ANIMATION (GSAP ONLY)
    if (useGSAP) {
        const path = document.querySelector(".flow-line");
        if (path) {
            const pathLength = path.getTotalLength();
            gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
            gsap.to(path, {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: ".philo-wrapper",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                },
                ease: "none",
            });
        }

        // CONTENT ENTRANCE (GSAP ONLY)
        const philoContent = document.querySelectorAll(".philo-content");
        philoContent.forEach((el) => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "expo.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            });
        });
    } else {
        // Fallback if GSAP is blocked: Show all content immediately
        document.querySelectorAll(".philo-content").forEach(el => el.style.opacity = "1");
        console.warn("GSAP blocked or missing - using CSS fallback for entrance animations.");
    }

    // --- 2. STANDALONE CANVAS ENGINE (NO DEPENDENCIES) ---
    const setupGraphic = (id, drawFn) => {
        const container = document.getElementById(id);
        if (!container) return;

        // Clean slate
        container.innerHTML = "";
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);
        container.style.backgroundImage = 'none';

        const state = { 
            mouse: { x: 0, y: 0, active: false }, 
            active: true, // Default to true if observer fails
            time: 0
        };

        const resize = () => {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width * (window.devicePixelRatio || 1);
            canvas.height = rect.height * (window.devicePixelRatio || 1);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        };

        window.addEventListener('resize', resize);
        resize();

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            state.mouse.x = e.clientX - rect.left;
            state.mouse.y = e.clientY - rect.top;
            state.mouse.active = true;
        });

        container.addEventListener('mouseleave', () => { state.mouse.active = false; });

        // Observer fallback
        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                state.active = entries[0].isIntersecting;
            }, { threshold: 0.1 });
            observer.observe(container);
        }

        const animate = () => {
            if (state.active) {
                state.time += 0.015;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawFn(ctx, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1), state);
            }
            requestAnimationFrame(animate);
        };
        animate();
    };

    // SCENE 01: UNITY (The Interconnected Core - Prominent)
    setupGraphic('graphic-unity', (ctx, w, h, state) => {
        const center = { x: w/2, y: h/2 };
        const particles = 30;
        const labels = ["NERVEN", "ORGANE", "GEWEBE", "PSYCHE", "ZUSTAND"];
        
        ctx.strokeStyle = 'rgba(172, 138, 90, 0.4)';
        ctx.fillStyle = '#AC8A5A';
        ctx.font = "bold 13px 'Outfit', sans-serif";
        ctx.textAlign = "center";

        if (!state.mouse.active) {
            ctx.fillStyle = 'rgba(172, 138, 90, 0.5)';
            ctx.fillText("BEWEGE DIE MAUS: ALLES IST VERBUNDEN", w/2, h - 30);
        }

        // Pulsing Core
        const coreSize = 50 + Math.sin(state.time) * 10;
        ctx.beginPath();
        ctx.arc(center.x, center.y, coreSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(172, 138, 90, 0.1)';
        ctx.fill();

        for (let i = 0; i < particles; i++) {
            const orbitDist = 140 + Math.sin(state.time * 0.5 + i) * 40;
            const angle = (i / particles) * Math.PI * 2 + state.time * 0.4;
            const x = center.x + Math.cos(angle) * orbitDist;
            const y = center.y + Math.sin(angle) * orbitDist;

            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(x, y);
            ctx.globalAlpha = 0.2;
            ctx.stroke();
            ctx.globalAlpha = 1;

            ctx.fillStyle = '#AC8A5A';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();

            const dx = x - state.mouse.x;
            const dy = y - state.mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(state.mouse.x, state.mouse.y);
                ctx.stroke();
                
                if (i % 6 === 0) {
                    ctx.fillStyle = '#f5efe6';
                    ctx.fillText(labels[i/6 % labels.length], x, y - 15);
                }
            }
        }
    });

    // SCENE 02: SELF-HEALING (The Healing Grid - Vibrant)
    setupGraphic('graphic-healing', (ctx, w, h, state) => {
        const spacing = 45;
        const cols = Math.floor(w / spacing);
        const rows = Math.floor(h / spacing);
        ctx.font = "bold 14px 'Outfit', sans-serif";
        ctx.textAlign = "center";

        if (!state.mouse.active) {
            ctx.fillStyle = 'rgba(172, 138, 90, 0.5)';
            ctx.fillText("AKTIVIERE DEN INNEREN ARZT", w/2, h - 30);
        }
        
        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                const x = (w - (cols * spacing)) / 2 + i * spacing;
                const y = (h - (rows * spacing)) / 2 + j * spacing;
                
                const dx = x - state.mouse.x;
                const dy = y - state.mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                const isHealed = dist < 140;
                const size = isHealed ? 8 + Math.sin(state.time * 6) * 3 : 2;
                const alpha = isHealed ? 1 : 0.2;

                ctx.fillStyle = `rgba(172, 138, 90, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                
                if (isHealed && i === Math.floor(cols/2) && j === Math.floor(rows/2)) {
                    ctx.fillStyle = '#f5efe6';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#AC8A5A';
                    ctx.fillText("SELBSTHEILUNG", x, y - 25);
                    ctx.shadowBlur = 0;
                }
            }
        }
    });

    // SCENE 03: STRUCTURE (The Alignment Spine - Solid)
    setupGraphic('graphic-structure', (ctx, w, h, state) => {
        const joints = 12;
        const jHeight = 20;
        const jWidth = 140;
        const jGap = 42;
        ctx.font = "bold 12px 'Outfit', sans-serif";

        if (!state.mouse.active) {
            ctx.fillStyle = 'rgba(172, 138, 90, 0.5)';
            ctx.textAlign = "center";
            ctx.fillText("BRINGE DIE WIRBEL IN BALANCE", w/2, h - 30);
        }

        ctx.strokeStyle = '#AC8A5A';
        ctx.lineWidth = 2;

        for (let i = 0; i < joints; i++) {
            let x = w / 2;
            let y = (h - (joints * jGap)) / 2 + i * jGap;
            const distToCenter = Math.abs(state.mouse.x - w/2);
            const alignment = Math.max(0, 1 - distToCenter / 220);
            
            const offset = Math.sin(state.time * 1.5 + i) * 25 * (1 - alignment);
            x += offset;

            ctx.globalAlpha = 0.2 + (alignment * 0.8);
            ctx.strokeRect(x - jWidth/2, y, jWidth, jHeight);
            
            if (alignment > 0.92 && i === 5) {
                ctx.fillStyle = '#f5efe6';
                ctx.fillText("STRUKTUR REGIRT FUNKTION", x + jWidth/2 + 20, y + 15);
            }
            ctx.globalAlpha = 1;
        }
    });

    // SCENE 04: VITALITY (The Breath Sphere - Radiant)
    setupGraphic('graphic-vitality', (ctx, w, h, state) => {
        const center = { x: w/2, y: h/2 };
        const breath = (Math.sin(state.time * 1.2) + 1) / 2;
        ctx.font = "bold 16px 'Outfit', sans-serif";
        ctx.textAlign = "center";

        if (!state.mouse.active) {
            ctx.fillStyle = 'rgba(172, 138, 90, 0.5)';
            ctx.fillText("DEN ATEM DES SEINS SPÜREN", w/2, h - 30);
        }

        for (let i = 0; i < 4; i++) {
            const current = ((state.time * 0.4 + i / 4) % 1);
            const radius = current * 240;
            ctx.strokeStyle = `rgba(172, 138, 90, ${1 - current})`;
            ctx.lineWidth = 1 + (1 - current) * 5;
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, 80 + breath * 40);
        grad.addColorStop(0, 'rgba(172, 138, 90, 0.9)');
        grad.addColorStop(0.5, 'rgba(172, 138, 90, 0.3)');
        grad.addColorStop(1, 'rgba(172, 138, 90, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 120 + breath * 30, 0, Math.PI * 2);
        ctx.fill();

        if (breath > 0.85) {
            ctx.fillStyle = '#f5efe6';
            ctx.fillText("BREATH OF LIFE", center.x, center.y + 6);
        }
    });
};

window.addEventListener('DOMContentLoaded', initPhiloInteraction);
