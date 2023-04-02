export class OveralpingRect {
    
    _leftBottom = {x: 0, y: 0}
    _topRight = {x: 0, y: 0}
    
    constructor(x1, y1, x2, y2){
        this._leftBottom = {x: x1, y: y1};
        this._topRight = {x: x2, y: y2};
    }

    get height(){
        return Math.abs(this._leftBottom.y - this._topRight.y)
    }

    get width(){
        return Math.abs(this._leftBottom.x - this._topRight.x)
    }
}


/**
 * @param {HTMLElement} el1
 * @param {HTMLElement} el2
 */
export function getIntersectionRect(el1, el2){
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    const left = Math.max(rect1.left, rect2.left);
    const top = Math.max(rect1.top, rect2.top);
    const right = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
    const bottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height); 

    const xOverlap = right - left;
    const yOverlap = bottom - top;

    if(xOverlap <= 0 || yOverlap <= 0){
     return null;
    }

    return new OveralpingRect(left, bottom, right, top);
}
