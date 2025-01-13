// Select the canvas and set up the context
const canvas = document.getElementById('cloudCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size dynamically
canvas.width = window.innerWidth;
canvas.height = document.querySelector('header').offsetHeight; // Set height to match the header

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('header').offsetHeight; // Set height to match the header
    initPoints(); // Reinitialize points with new canvas size
});

// Mouse position tracking
let mouse = { x: null, y: null };

// Handle mouse events on the canvas
const header = document.querySelector('header');
header.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

header.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Points array
let points = [];

// Create points based on canvas size
function initPoints() {
    points = [];
    let pointCount;
    if (window.innerWidth <= 480) {
        pointCount = 50; // Fewer points for smartphones
    } else if (window.innerWidth <= 768) {
        pointCount = 100; // Moderate points for tablets
    } else {
        pointCount = 150; // More points for desktops
    }

    for (let i = 0; i < pointCount; i++) {
        points.push({
            x: Math.random() * canvas.width,   // Random x within canvas width
            y: Math.random() * canvas.height,  // Random y within canvas height
            size: Math.random() * 3 + 1,       // Random point size
            vx: (Math.random() - 0.5) * 0.2,   // Reduced x velocity
            vy: (Math.random() - 0.5) * 0.2    // Reduced y velocity
        });
    }
}

// Draw points on canvas
function drawPoints() {
    points.forEach(point => {
        const distanceToMouse = mouse.x !== null ? Math.hypot(mouse.x - point.x, mouse.y - point.y) : Infinity;

        // Adjust size based on proximity to mouse
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

            // Only draw lines between points within a certain distance
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

                point.vx += Math.cos(angle) * force * 0.02; // Reduced force
                point.vy += Math.sin(angle) * force * 0.02; // Reduced force
            }
        }

        // Update point position with velocity
        point.x += point.vx;
        point.y += point.vy;

        // Bounce points off the edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
    });
}

// Draw text on canvas
function drawText() {
    const fontSize = getResponsiveFontSize();
    ctx.font = `${fontSize}px "Courier New", Courier, monospace`; // Change the font here
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (window.innerWidth <= 480) {
        // Split text into two lines for smaller screens
        ctx.fillText('Thomas', canvas.width / 2, canvas.height / 2 - fontSize / 2);
        ctx.fillText('Menu', canvas.width / 2, canvas.height / 2 + fontSize / 2);
    } else {
        // Single line for larger screens
        ctx.fillText('Thomas Menu', canvas.width / 2, canvas.height / 2);
    }
}

// Get responsive font size
function getResponsiveFontSize() {
    if (window.innerWidth <= 480) {
        return 50; // Font size for smartphones
    } else if (window.innerWidth <= 768) {
        return 75; // Font size for tablets
    } else {
        return 100; // Font size for desktops
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame
    drawPoints();
    drawLines();
    applyGravity();
    drawText(); // Draw the text in the middle of the canvas
    requestAnimationFrame(animate);
}

// Initialize points and start animation
initPoints();
animate();