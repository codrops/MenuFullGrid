import { calcWinsize, scrollIt } from './utils';
import {gsap} from 'gsap';
import MenuItem from './menuItem';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

export default class MenuController {
    constructor(el) {
        this.DOM = {el: el};
        // Set of small images each selected menu item has on the background
        this.DOM.galleries = [...document.querySelectorAll('.bg-gallery-wrap > .bg-gallery')];
        // Content DOM
        this.DOM.pagePreview = document.querySelector('.page--preview');
        this.DOM.content = [...this.DOM.pagePreview.querySelectorAll('.content')];
        // "Choose a project" element (line + text)
        this.DOM.headline = {
            deco: this.DOM.el.querySelector('.menu__headline > .menu__headline-deco'),
            text: this.DOM.el.querySelector('.menu__headline > .menu__headline-text > span')
        };
        // array of all MenuItems
        this.menuItems = [];
        [...this.DOM.el.querySelectorAll('.menu__item')].forEach((item, pos) => {
            this.menuItems.push(new MenuItem(item, this.DOM.galleries[pos], this.DOM.content[pos]));
        });
        
        this.init();
    }
    init() {
        // Current menu item index (starting with the first one).
        this.current = 0;
        // Highlight the current menu item
        this.menuItems[this.current].highlight();
        // Init/Bind events
        this.initEvents();
    }
    initEvents() {
        for (const [pos, item] of this.menuItems.entries()) {
            
            // Click/Select a menu item
            item.DOM.el.addEventListener('click', ev => {
                ev.preventDefault();
                if ( pos === this.current || this.isAnimating ) return;
                
                const direction = this.current < pos ? 'up' : 'down';

                this.toggleMenuItems(item, direction);

                // Update current value
                this.current = pos;
            });

            // click on the menu item's explore 
            item.DOM.cta.addEventListener('click', ev => {
                if ( this.isAnimating ) return;
                
                this.showContent(item);
            });

            // Click on the back control when at the page preview
            item.contentPage.DOM.backCtrl.addEventListener('click', ev => {
                ev.preventDefault();
                //if ( this.isAnimating ) return;
                
                this.showMenu(item);
            });

        }
    }
    // Click/Select a menu item
    // Animate all the bg images out and animate the new menu item's in
    toggleMenuItems(upcomingItem, direction = 'up') {
        const currentItem = this.menuItems[this.current];
        const dir = direction === 'up' ? 1 : -1;
        
        currentItem.toggleCurrent();
        upcomingItem.toggleCurrent();
        
        gsap
        .timeline({
            defaults: {
                duration: 1, 
                ease: 'expo.inOut'
            },
            onStart: () => this.isAnimating = true,
            onComplete: () => this.isAnimating = false
        })
        .to(upcomingItem.DOM.title, {
            ease: 'expo.in',
            duration: 0.5,
            y: dir*-100+'%',
        }, 0)
        .to(upcomingItem.DOM.title, {
            ease: 'expo',
            duration: 0.8,
            startAt: {y: dir*100+'%'},
            y: '0%'
        }, 0.5)
        .to(currentItem.DOM.deco, {
            scaleY: 0,
            opacity: 0
        }, 0)
        .to(currentItem.DOM.cta, {
            y: '100%',
            opacity: 0
        }, 0)
        .to(currentItem.DOM.galleryItems, {
            y: dir*-winsize.height*1.2,
            stagger: dir*0.05,
            rotation: gsap.utils.random(-30,30)
        }, 0)
        .addLabel('upcomingImages', 0.1)
        .to(upcomingItem.DOM.deco, {
            startAt: {scaleY: 0},
            scaleY: 1,
            opacity: 1
        }, 'upcomingImages')
        .to(upcomingItem.DOM.cta, {
            startAt: {y: dir*100+'%'},
            y: '0%',
            opacity: 1
        }, 'upcomingImages')
        .to(upcomingItem.DOM.galleryItems, {
            startAt: {y: dir*winsize.height*1.2, rotation: gsap.utils.random(-30,30)},
            y: 0,
            opacity: 1,
            rotation: 0,
            stagger: dir*0.05
        }, 'upcomingImages');
    }
    // Hide the menu items and all other initial elements, and show the content for this menu item
    showContent(menuItem) {
        const timelineDefaults = {
            duration: 0.8, 
            ease: 'expo.inOut'
        };

        gsap
        .timeline({
            defaults: timelineDefaults,
            onStart: () => this.isAnimating = true,
            onComplete: () => this.isAnimating = false
        })
        .to(menuItem.DOM.deco, {scaleY: 0})
        .to(menuItem.DOM.ctaInner, {y: '100%'}, 0)
        .to(menuItem.DOM.galleryItems, {
            y: -winsize.height*1.2,
            opacity: 0,
            stagger: 0.05,
            rotation: gsap.utils.random(-30,30)
        }, 0)
        .to(this.menuItems.map(item => item.DOM.title), {
            y: '100%',
            stagger: {each: 0.03, from: 'end'}
        }, 0)
        .to(this.DOM.headline.deco, {scaleX: 0}, 0)
        .to(this.DOM.headline.text, {y: '100%'}, 0)
        .addLabel('showPageContent', timelineDefaults.duration*.1)
        .to(menuItem.contentPage.DOM.backCtrl, {
            startAt: {x: '50%'},
            x: '0%',
            opacity: 1
        }, 'showPageContent')
        .to([menuItem.contentPage.DOM.titleInner, menuItem.contentPage.DOM.introInner, menuItem.contentPage.DOM.dateInner], {
            startAt: {y: '-100%'},
            onStart: () => {
                gsap.set([menuItem.contentPage.DOM.title, menuItem.contentPage.DOM.intro, menuItem.contentPage.DOM.date], {
                    opacity: 1, 
                    stagger: -0.06
                })
            },
            y: '0%',
            stagger: -0.06
        }, 'showPageContent')
        .to(menuItem.contentPage.DOM.galleryItems, {
            startAt: {y: '100%', rotation: () => gsap.utils.random(-20,20)},
            y: '0%',
            rotation: 0,
            opacity: 1,
            stagger: 0.08
        }, 'showPageContent')
        .to(document.body, {backgroundColor: menuItem.contentPage.bgcolor}, 0);

        this.DOM.pagePreview.classList.remove('page--preview');
        menuItem.DOM.content.classList.add('content--current');
    }
    // Show back the menu
    showMenu(menuItem) {
        const timelineDefaults = {
            duration: 0.8, 
            ease: 'expo.inOut'
        };

        // Scroll up first
        scrollIt(0, 300, 'easeOutQuad', () => {
            gsap
            .timeline({
                defaults: timelineDefaults,
                onStart: () => this.isAnimating = true,
                onComplete: () => {
                    this.DOM.pagePreview.classList.add('page--preview');
                    menuItem.DOM.content.classList.remove('content--current');
                    this.isAnimating = false;
                }
            })
            .to(document.body, {backgroundColor: '#EAE4DE'}, 0)
            .to(menuItem.contentPage.DOM.galleryItems, {
                y: '100%',
                rotation: () => gsap.utils.random(-20,20),
                opacity: 0,
                stagger: 0.08
            }, 0)
            .to([menuItem.contentPage.DOM.titleInner, menuItem.contentPage.DOM.introInner, menuItem.contentPage.DOM.dateInner], {
                onComplete: () => {
                    gsap.set([menuItem.contentPage.DOM.title, menuItem.contentPage.DOM.intro, menuItem.contentPage.DOM.date], {
                        opacity: 0
                    })
                },
                y: '-100%',
                stagger: 0.06
            }, 0)
            .to(menuItem.contentPage.DOM.backCtrl, {
                x: '50%',
                opacity: 0
            }, 0)
            .addLabel('showMenuItems', timelineDefaults.duration*.1)
            .to(this.DOM.headline.text, {y: '0%'}, 'showMenuItems')
            .to(this.DOM.headline.deco, {scaleX: 1}, 'showMenuItems')
            .to(this.menuItems.map(item => item.DOM.title), {
                y: '0%',
                stagger: {each: 0.03, from: 'start'}
            }, 'showMenuItems')
            .to(menuItem.DOM.galleryItems, {
                startAt: {rotation: gsap.utils.random(-30,30)},
                y: 0,
                stagger: -0.05,
                rotation: 0,
                opacity: 1
            }, 'showMenuItems')
            .to(menuItem.DOM.ctaInner, {y: '0%'}, 'showMenuItems')
            .to(menuItem.DOM.deco, {scaleY: 1}, 'showMenuItems')
        });
    }
}