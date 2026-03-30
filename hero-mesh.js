const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
    const heroCtx = heroCanvas.getContext('2d');
    let points = [];
    const rows = 15;
    const cols = 25;
    const mouseHero = { x: -1000, y: -1000, radius: 250 };
    let scrollProgress = 0;

    function resizeHero() {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
        initHero();
    }

    function initHero() {
        points = [];
        const spacingX = heroCanvas.width / (cols - 1);
        const spacingY = heroCanvas.height / (rows - 1);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                points.push({
                    x: x * spacingX,
                    y: y * spacingY,
                    originX: x * spacingX,
                    originY: y * spacingY,
                    vx: 0,
                    vy: 0
                });
            }
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouseHero.x = e.clientX;
        mouseHero.y = e.clientY;
    });

    window.addEventListener('scroll', () => {
        scrollProgress = window.scrollY / 500;
        if (scrollProgress > 1) scrollProgress = 1;
    });

    function animateHero() {
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
        
        const spacingX = heroCanvas.width / (cols - 1);
        const spacingY = heroCanvas.height / (rows - 1);

        points.forEach((p, i) => {
            // Mouse Interaction
            let dx = mouseHero.x - p.x;
            let dy = mouseHero.y - p.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouseHero.radius) {
                let force = (mouseHero.radius - dist) / mouseHero.radius;
                p.vx -= (dx / dist) * force * 10;
                p.vy -= (dy / dist) * force * 10;
            }

            // Return to Origin
            let targetX = p.originX;
            let targetY = p.originY;

            // Scroll Effect: Condense to center line
            if (scrollProgress > 0) {
                const centerY = heroCanvas.height / 2;
                targetY = p.originY + (centerY - p.originY) * scrollProgress;
            }

            p.vx += (targetX - p.x) * 0.05;
            p.vy += (targetY - p.y) * 0.05;

            p.vx *= 0.9;
            p.vy *= 0.9;

            p.x += p.vx;
            p.y += p.vy;

            // Draw line to right neighbor
            if ((i + 1) % cols !== 0) {
                heroCtx.beginPath();
                heroCtx.moveTo(p.x, p.y);
                heroCtx.lineTo(points[i + 1].x, points[i+1].y);
                heroCtx.strokeStyle = `rgba(139, 168, 137, ${0.1 * (1 - scrollProgress)})`;
                heroCtx.stroke();
            }

            // Draw line to bottom neighbor
            if (i < points.length - cols) {
                heroCtx.beginPath();
                heroCtx.moveTo(p.x, p.y);
                heroCtx.lineTo(points[i + cols].x, points[i + cols].y);
                heroCtx.strokeStyle = `rgba(139, 168, 137, ${0.05 * (1 - scrollProgress)})`;
                heroCtx.stroke();
            }
        });

        requestAnimationFrame(animateHero);
    }

    window.addEventListener('resize', resizeHero);
    resizeHero();
    animateHero();
}
