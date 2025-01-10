// Select the canvas and set up the context
const canvas = document.getElementById('cloudCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initPoints(); // Reinitialize points on resize
});

// Mouse position tracking
let mouse = { x: null, y: null };

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Create points
let points = [];
const pointCount = 150;

function initPoints() {
    points = [];
    for (let i = 0; i < pointCount; i++) {
        points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
        });
    }
}

// Draw points on canvas
function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(point => {
        const distanceToMouse = mouse.x !== null ? Math.hypot(mouse.x - point.x, mouse.y - point.y) : Infinity;

        // Change size based on proximity to mouse
        const size = distanceToMouse < 100 ? point.size * 2 : point.size;

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = distanceToMouse < 100 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(200, 200, 255, 0.7)';
        ctx.fill();
    });
}

// Update point positions
function updatePoints() {
    points.forEach(point => {
        point.x += point.vx;
        point.y += point.vy;

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        // React to mouse
        if (mouse.x !== null) {
            const dx = point.x - mouse.x;
            const dy = point.y - mouse.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                point.vx += Math.cos(angle) * 0.1;
                point.vy += Math.sin(angle) * 0.1;
            }
        }
    });
}

// Animation loop
function animate() {
    drawPoints();
    updatePoints();
    requestAnimationFrame(animate);
}

// Initialize points and start animation
initPoints();
animate();