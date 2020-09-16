import { preloadImages, preloadFonts } from './utils';
import Cursor from './cursor';
import MenuController from './menuController';

// Preload  images and fonts
Promise.all([preloadImages('.gallery__figure-img'), preloadFonts('yuz0mhb')]).then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');

    // Initialize custom cursor
    const cursor = new Cursor(document.querySelector('.cursor'));

    // Initialize the MenuController
    new MenuController(document.querySelector('.menu'));

    // Mouse effects on all links
    [...document.querySelectorAll('a')].forEach(link => {
        link.addEventListener('mouseenter', () => cursor.enter());
        link.addEventListener('mouseleave', () => cursor.leave());
    });
});