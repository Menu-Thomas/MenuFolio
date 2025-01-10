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
            size: Math.random() * 3 + 1,
        });
    }
}

// Draw points on canvas
function drawPoints() {
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

// Draw lines between points randomly
function drawLines() {
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const pointA = points[i];
            const pointB = points[j];

            // Calculate distance between the points
            const distance = Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);

            // Only draw lines between points that are within a certain distance
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(pointA.x, pointA.y);
                ctx.lineTo(pointB.x, pointB.y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 150})`; // Transparent lines based on distance
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

// Apply gravity effect to points based on mouse position
function applyGravity() {
    points.forEach(point => {
        if (mouse.x !== null) {
            const dx = mouse.x - point.x;
            const dy = mouse.y - point.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 150) {
                // Apply gravity effect: pull points closer to the mouse
                const angle = Math.atan2(dy, dx);
                const force = (150 - distance) / 150; // Inverse of distance (stronger attraction closer to the mouse)

                point.x += Math.cos(angle) * force;
                point.y += Math.sin(angle) * force;
            }
        }
    });
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame
    drawPoints();
    drawLines();
    applyGravity();
    requestAnimationFrame(animate);
}

// Initialize points and start animation
initPoints();
animate();