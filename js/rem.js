window.use_screen_base = 750;
(function(doc, win) {
    var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        base_size = use_screen_base,
        docE = doc.documentElement,
        recalc = function() {
            var triggerRepaints = docE.clientWidth;
            var clientWidth = win.innerWidth;
            var fontSize = 100 * ((clientWidth > 600 ? 600 : clientWidth) / base_size);
            docE.style.fontSize = fontSize + 'px';
        };
    recalc();
    win.addEventListener(resizeEvt, recalc, false);
    delete use_screen_base;
})(document, window);