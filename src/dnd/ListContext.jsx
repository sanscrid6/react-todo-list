import { createContext, useMemo, useState, useRef, useLayoutEffect } from "react";
import { getByListIndex, getTranslation } from "./utils";
import { getIntersectionRect } from "./OverlapingRect";

export const DraggableListContext = createContext({
    items: [],
    registerListItem: (id, ref, itemData, metaData) => {},
    removeListItem: (id) => {},
    reportDragStart: (id) => {},
    reportDragEnd: (id) => {},
    onDrag: (id) => {} 
});


export function DraggableListProvider({listName, onDragEnd, children}){
    const [listItems, setListItems] = useState([]);
    const ref = useRef(null);
    
    const context = useMemo(() => ({
        items: listItems,
        registerListItem: (id, value, itemData, metaData) => {
            listItems.push({id, value, itemData, metaData});
            value.current.setAttribute('data-list-id', listName);
            value.current.setAttribute('data-list-index', listItems.length - 1);
        },
        removeListItem: (id) => {
            const index = listItems.findIndex(item => item.id === id);
            if(index !== -1){
                listItems.splice(index, 1);
            }
        },
        reportDragStart: id => {
            const index = listItems.findIndex(item => item.id === id);
            const target = listItems[index];

            target.value.current.setAttribute('data-start-index', +target.value.current.getAttribute('data-list-index'));

            const {width, height, left, top} =  target.value.current.getBoundingClientRect();
            ref.current.style.height = `${ref.current.getBoundingClientRect().height}px`;
           
            listItems.slice(index + 1, listItems.length).forEach(({value, id: itemId}) => {
                value.current.style.transform =  getTranslation(null, 0, height);
            })
           
            target.value.current.style.top = `${top}px`;
            target.value.current.style.left = `${left}px`;
            target.value.current.setAttribute('data-is-dragged', true);
            target.value.current.style.height = `${height}px`;
            target.value.current.style.width = `${width}px`;
            target.value.current.style.position = 'fixed';
            target.value.current.style.transition = `opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s`;
            target.value.current.style.boxSizing = 'border-box';
            target.value.current.style.zIndex = '10000';

        },
        reportDragEnd: id => {
            listItems.forEach(({value, id: itemId}, index) => {
                if(id !== itemId){
                    value.current.style = null;
                } else {
                    value.current.style = null;
                    value.current.setAttribute('data-is-dragged', false);
                }
            })

            ref.current.style = null;
            const newItems = []
            
            let outsideList = 0;
            for (const item of listItems) {
                //console.log(+item.value.current.getAttribute('data-list-index') || +item.value.current.getAttribute('data-start-index'))
                const index = item.value.current.getAttribute('data-list-index');
                const startIndex = item.value.current.getAttribute('data-start-index');
                if(index){
                    newItems[+index + outsideList] = item;

                } else if (startIndex){
                    outsideList++;
                    newItems[+startIndex] = item;   
                }
            }

           onDragEnd(newItems.filter(item => item.metaData.canDrag).map(item => ({...item.itemData})));
        },
        onDrag: id => {
            const overlapingRect = getIntersectionRect(ref.current, listItems.find(item => item.id === id).value.current);
            
            if(!overlapingRect){
                return;
            }

            const index = listItems.findIndex(item => item.id === id);
            const target = listItems[index].value;
          
            const {width, height, top} = target.current.getBoundingClientRect();
            
            if(overlapingRect.width < width / 2 || overlapingRect.height < height / 2){
                if(!target.current.hasAttribute('data-list-index')){
                    return;
                }

                target.current.removeAttribute('data-list-index');
                target.current.removeAttribute('data-list-id');
                
                listItems.filter(item => item.id !== id).forEach(({value}, index) => {
                   value.current.setAttribute('data-list-index', index);
                   value.current.style = null;
                })

                ref.current.style.height = `${ref.current.getBoundingClientRect().height - height}px`;
            }

            if(overlapingRect.width >= width / 2 && overlapingRect.height >= height / 2){
                let insertIndex = null;
                const items = listItems;
                
                for (let i = 0; i < items.length; i++) {
                    const {value, id: itemId} = items[i];

                    if(itemId !== id){
                        const rect = getIntersectionRect(target.current, value.current);
                        const {height: itemHeight, width: itemWidth} = value.current.getBoundingClientRect();

                        if(rect && (rect.height > itemHeight / 2 && rect.width > itemWidth / 2)){
                            insertIndex = +value.current.getAttribute('data-list-index');
                            break;
                        }
                    } 
                }

                const hasIndex = target.current.getAttribute('data-list-index');

                if(insertIndex == null){
                    return;
                }
                
                if(hasIndex != null){
                    const swapIndex = +target.current.getAttribute('data-list-index');

                    const swapItem = getByListIndex(items, insertIndex).value.current;

                    /*if(swapItem.getAnimations().length > 0){
                        return;
                    }
    
                    listItems.forEach(item => {
                        item.value.current.getAnimations().forEach(animation => animation.finish());
                    })*/
                    
                    target.current.setAttribute('data-list-id', listName);
                    swapItem.setAttribute('data-list-index', swapIndex);
                    target.current.setAttribute('data-list-index', insertIndex);
                    
                    const {top: swapItemTop} = swapItem.getBoundingClientRect();
    
                    //swapItem.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
                    
                    console.log('swap in');
                    if(insertIndex !== 0){
                        swapItem.style.transform = getTranslation(swapItem.style.transform, 0, Math.sign(top - swapItemTop) * height);
                    } else {
                        swapItem.style.transform = getTranslation(null, 0, height);
                    }

                } else {
                    console.log('swap from out')
                    listItems.filter(item => item.id !== id).forEach(item => {
                        const index = +item.value.current.getAttribute('data-list-index');
                        if(index >= insertIndex){
                            item.value.current.style.transform = getTranslation(item.value.current.style.transform, 0, height);
                            item.value.current.setAttribute('data-list-index', index + 1);
                        }
                        target.current.setAttribute('data-list-index', insertIndex);
                    })

                    ref.current.style.height = `${ref.current.getBoundingClientRect().height + height}px`;
                }

                
                

                //ref.current.style = null;
                //ref.current.style.height = `${ref.current.getBoundingClientRect().height + height}px`;

                /*const newItems = [] 
                for(let i = 0; i < items.length; i++){
                    const {value, id: itemId} = items[i];
                    const index = +value.current.getAttribute('data-list-index');

                    newItems[index] = items[i];
                
                }

                console.log(newItems)

                setListItems(newItems)*/

                /*for (let i = insertIndex; i < items.length; i++) {
                    const {value, id: itemId} = items[i];
                    
                    if(itemId !== id){
                        value.current.style.transform = `translate(0px, ${targetHeight}px)`;
                    }
                    
                }*/

                //console.log('insert', insertIndex);
            }
        }
    }), [])

    const props = useMemo(() => ({forwardedRef: ref, 'data-list-id': listName}), []);

    return (
        <DraggableListContext.Provider 
            value={context}
        >
            {children(props)}
        </DraggableListContext.Provider>
    )
}