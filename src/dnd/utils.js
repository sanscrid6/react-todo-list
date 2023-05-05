//translate(0px, 0px)
export function getTranslation(translation, x, y){
    let prevX = 0, prevY = 0;
    if(translation){
        const temp = translation.split(', ');
        prevX = +temp[0].slice(10, temp[0].length - 2);
        prevY = +temp[1].slice(0, temp[1].length - 3);
    }
    const newX = prevX + x;
    const newY = prevY + y;

    return `translate(${newX.toFixed(4)}px, ${newY.toFixed(4)}px)`
}

export function getByListIndex(listItems, index){
    return listItems.find(item => +item.value.current.getAttribute('data-list-index') === index);
}

export function resetStyles(value){
    value.current.style.top = ``;
    value.current.style.left = ``;
    value.current.style.height = ``;
    value.current.style.width = ``;
    value.current.style.position = '';
    value.current.style.transition = ``;
    value.current.style.boxSizing = '';
    value.current.style.zIndex = '';
    value.current.style.transform = '';
}

export function setAttribute(target, name, value){
    target.current.setAttribute(name, value)
}

export function getAttribute(target, name){
    return target.current.getAttribute(name)
}


export function setStyles(target, {top, left, height, width}){
    target.value.current.style.top = `${top+window.scrollY}px`;
    target.value.current.style.left = `${left}px`;
    target.value.current.style.height = `${height}px`;
    target.value.current.style.width = `${width}px`;
    target.value.current.style.position = 'absolute';
    target.value.current.style.transition = `opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s`;
    target.value.current.style.boxSizing = 'border-box';
    target.value.current.style.zIndex = '10000';
}
