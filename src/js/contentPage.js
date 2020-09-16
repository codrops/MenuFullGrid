
export default class ContentPage {
    constructor(el) {
        this.DOM = {
            el: el
        };
        this.DOM.backCtrl = this.DOM.el.querySelector('.content__back');
        this.DOM.title = this.DOM.el.querySelector('.content__title');
        this.DOM.titleInner = this.DOM.title.querySelector('span');
        this.DOM.intro = this.DOM.el.querySelector('.content__intro');
        this.DOM.introInner = this.DOM.intro.querySelector('span');
        this.DOM.date = this.DOM.el.querySelector('.content__date');
        this.DOM.dateInner = this.DOM.date.querySelector('span');
        this.DOM.gallery = this.DOM.el.querySelector('.gallery');
        this.DOM.galleryItems = this.DOM.gallery.querySelectorAll('.gallery__figure');
        this.bgcolor = this.DOM.el.dataset.bgcolor;
    }
}