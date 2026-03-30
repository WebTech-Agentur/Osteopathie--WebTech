const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
canvas.style.background = '#FDFCF8';

let particles = [];
const particleCount = 120;
let mouse = { x: -100, y: -100, radius: 150 };
let ripple = { x: 0, y: 0, r: 0, active: false };

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1;
        this.density = (Math.random() * 30) + 1;
        this.color = 'rgba(139, 168, 137, 0.15)'; // Sage Green transparent
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }

        // Ripple Effect
        if (ripple.active) {
            let rdx = ripple.x - this.x;
            let rdy = ripple.y - this.y;
            let rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            if (Math.abs(rdist - ripple.r) < 20) {
                this.color = 'rgba(139, 168, 137, 0.8)';
            } else {
                this.color = 'rgba(139, 168, 137, 0.15)';
            }
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
init();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    if (ripple.active) {
        ripple.r += 15;
        if (ripple.r > canvas.width * 1.5) {
            ripple.active = false;
            ripple.r = 0;
        }
    }
    
    requestAnimationFrame(animate);
}
animate();

// Global Ripple Trigger function
window.triggerRipple = function(x, y) {
    ripple.x = x || canvas.width / 2;
    ripple.y = y || canvas.height / 2;
    ripple.r = 0;
    ripple.active = true;
};
