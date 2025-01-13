let currentImageIndex = 0;
const images = [
    'images/project1-image1.jpg',
    'images/project1-image2.jpg',
    'images/project1-image3.jpg'
    // Add more image paths as needed
];

function showImage(index) {
    const imageElement = document.querySelector('.binder-image');
    if (imageElement) {
        imageElement.src = images[index];
    } else {
        console.error('Image element not found');
    }
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showImage(currentImageIndex);
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
}

function currentImage(index) {
    currentImageIndex = index;
    showImage(currentImageIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    showImage(currentImageIndex);
});