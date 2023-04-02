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

export function getIndex(){
    
}