let currentIndex = 0;
const images = [
    'project1-image1.jpg',
    'project1-image2.jpg',
    'project1-image3.jpg'
    // Add more image paths as needed
];

function showImage(index) {
    const imageElement = document.querySelector('.binder-image');
    const dots = document.querySelectorAll('.dot');
    if (index >= images.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = images.length - 1;
    } else {
        currentIndex = index;
    }
    imageElement.src = images[currentIndex];
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });
}

function nextImage() {
    showImage(currentIndex + 1);
}

function prevImage() {
    showImage(currentIndex - 1);
}

function currentImage(index) {
    showImage(index - 1);
}

// Initialize the first image
document.addEventListener('DOMContentLoaded', () => {
    showImage(currentIndex);
});