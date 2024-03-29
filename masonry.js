

class mesonry {
    constructor(el){
        this.el = el;
        this.el.classList.add('-Js');
        this.rObserver = new ResizeObserver(() => {
            this.render();
        });
        this.rObserver.observe(el);
        this.render();
    }
    render(){
        const container = this.el;
        const widthContainer = container.clientWidth;
        if (!widthContainer) return;
        let minWidth = cssLengthToPixelsStyle(container, '--u1-Items-width') || 200;
        const rowGap = cssLengthToPixelsStyle(container, 'row-gap') ?? 0;
        const columnGap = cssLengthToPixelsStyle(container, 'column-gap') ?? 0;
        minWidth = Math.min(widthContainer, minWidth);
    
        const columns = Math.floor((widthContainer + columnGap) / (minWidth + columnGap));
        const columnWidth = (widthContainer - columnGap * (columns - 1)) / columns;
        const children = container.children;
        const columnHeights = [];
        for (let i = 0; i < columns; i++){
            columnHeights[i] = [i, 0];
        }
        var i=0, current;
        while (current = children[i++]){
            if (current.offsetParent === null) continue;
            current.style.width = columnWidth + 'px';
            current.style.left = columnHeights[0][0] * (columnWidth + columnGap) + 'px';
            current.style.top  = columnHeights[0][1] + 'px';
            columnHeights[0][1] += current.offsetHeight + rowGap;
            columnHeights.sort(sortByHeight);
            this.rObserver.observe(current);
        }
        container.style.height = columnHeights[columns - 1][1] - rowGap + 'px'; // subtract rowGap because there is no gap after the last item
    }    
}

function sortByHeight(a, b){
    return a[1] - b[1] || a[0] - b[0];
}

// https://cdn.jsdelivr.net/gh/u1ui/SelectorObserver.js@4.0.0/SelectorObserver.min.js
import {SelectorObserver} from '../SelectorObserver.js@4.0.0/SelectorObserver.min.js'
new SelectorObserver({
    on: el => new mesonry(el),
}).observe('[u1-masonry]');


/* helper */
function cssLengthToPixelsStyle(element, property) {
    const length = getComputedStyle(element).getPropertyValue(property);
    return cssLengthToPixels(length, element);
}
function cssLengthToPixels(length, element) {
    if (length === undefined) return undefined;
    length = length.trim();
    const value = parseFloat(length);
    const unit = length.match(/\D+$/)[0];
    switch (unit) {
        case '':
        case 'px':
            return value;
        case 'em':
            const fontSize = parseFloat(getComputedStyle(element).fontSize);
            return value * fontSize;
        case 'rem':
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            return value * rootFontSize;
        case '%':
            const parentSize = parseFloat(getComputedStyle(element.parentNode).width);
            return (value / 100) * parentSize;
        case 'vh':
            return value * (innerHeight / 100);
        case 'vw':
            return value * (innerWidth / 100);
        case 'vmin':
            return value * (Math.min(innerHeight, innerWidth) / 100);
        case 'vmax':
            return value * (Math.max(innerHeight, innerWidth) / 100);
        case 'pt':
            return value * 96 / 72;
        default:
            console.error('Unsupported length unit:', unit);
            return NaN;
    }
}
