import {gsap} from 'gsap';
import ContentPage from './contentPage';

export default class MenuItem {
    constructor(el, galleryEl, contentEl) {
        this.DOM = {
            el: el,
            gallery: galleryEl,
            content: contentEl
        };
        this.DOM.title = this.DOM.el.querySelector('.menu__item-title');
        this.DOM.deco = this.DOM.el.querySelector('.menu__item-deco');
        this.DOM.cta = this.DOM.el.querySelector('.menu__item-cta');
        this.DOM.ctaInner = this.DOM.cta.querySelector('span');
        this.DOM.galleryItems = [...this.DOM.gallery.querySelectorAll('.bg-gallery__item')];
        
        this.contentPage = new ContentPage(this.DOM.content);
        
        this.isCurrent = false;
    }
    highlight() {
        this.toggleCurrent();

        gsap.set([this.DOM.deco, this.DOM.cta], {opacity: 1});
        gsap.to(this.DOM.galleryItems, {
            duration: 1, 
            ease: 'expo',
            startAt: {scale: 0.01, rotation: gsap.utils.random(-20,20)},
            scale: 1,
            opacity: +this.isCurrent,
            rotation: 0,
            stagger: 0.05
        });
    }
    toggleCurrent() {
        this.DOM.el.classList[this.isCurrent ? 'remove' : 'add']('menu__item--selected');
        this.isCurrent = !this.isCurrent;
    }
}