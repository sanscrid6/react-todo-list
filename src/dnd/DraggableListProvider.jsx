import { createContext, useMemo, useState, useRef, useEffect, useContext } from "react";
import { getByListIndex, getTranslation } from "./utils";
import { getIntersectionRect } from "./OverlapingRect";
import { DragContext } from "./DragProvider";

export const DraggableListContext = createContext({
    items: [],
    registerListItem: (id, ref, itemData, metaData) => {},
    removeListItem: (id) => {},
    reportDragStart: (id) => {},
    reportDragEnd: (id, ref, data) => {},
    onDrag: (id, ref) => {} 
});


function resetStyles(value){
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


export function DraggableListProvider({listName, onDragEnd, children}){
    const [listItems] = useState([]);
    const ref = useRef(null);
    const dragContext = useContext(DragContext);
    
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
            target.value.current.setAttribute('data-start-list-id', listName);

            const {width, height, left, top} =  target.value.current.getBoundingClientRect();
            ref.current.style.height = `${ref.current.getBoundingClientRect().height}px`;
           
            listItems.slice(index + 1, listItems.length).forEach(({value, id: itemId}) => {
                value.current.style.transform =  getTranslation(null, 0, height);
            });

            target.value.current.setAttribute('data-is-dragged', true);
           
            target.value.current.style.top = `${top}px`;
            target.value.current.style.left = `${left}px`;
            target.value.current.style.height = `${height}px`;
            target.value.current.style.width = `${width}px`;
            target.value.current.style.position = 'fixed';
            target.value.current.style.transition = `opacity 0.2s cubic-bezier(0.2, 0, 0, 1) 0s`;
            target.value.current.style.boxSizing = 'border-box';
            target.value.current.style.zIndex = '10000';

        },
        reportDragEnd: (id, target, data, addNewItem=false) => {
           

            listItems.forEach(({value, id: itemId}, index) => {
                if(id !== itemId){
                   resetStyles(value)
                }
            })

            resetStyles(target);
            target.current.setAttribute('data-is-dragged', false);
            ref.current.style = null;

            const newItems = [];
            let outsideList = 0;

            for (const item of listItems) {
                const index = item.value.current.getAttribute('data-list-index');
                const startIndex = item.value.current.getAttribute('data-start-index');
                if(index){
                    newItems[+index + outsideList] = item;
                } else if (startIndex){
                    outsideList++;
                    newItems[+startIndex] = item;   
                }
            }

            if(addNewItem){
                newItems[+target.current.getAttribute('data-list-index')] = {itemData: {...data}, metaData: {canDrag: true}};
            }

            onDragEnd(newItems.filter(item => item.metaData.canDrag).map(item => ({...item.itemData})));
        },
        onDrag: (id, target) => {
            const overlapingRect = getIntersectionRect(ref.current, target.current);
            
            if(!overlapingRect){
                return;
            }
            
            const {width, height, top} = target.current.getBoundingClientRect();
            
            if(overlapingRect.width < width / 2 || overlapingRect.height < height / 2){
                if(!target.current.hasAttribute('data-list-id') || target.current.getAttribute('data-list-id') !== listName){
                    return;
                }

                target.current.removeAttribute('data-list-index');
                target.current.removeAttribute('data-list-id');
                
                listItems.filter(item => item.id !== id).forEach(({value}, index) => {
                   value.current.setAttribute('data-list-index', index);
                   resetStyles(value);
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

                if(items.length === 0){
                    insertIndex = 0;
                }

                const hasIndex = target.current.getAttribute('data-list-index');

                if(insertIndex == null){
                    return;
                }
                
                if(hasIndex != null){
                    const swapIndex = +target.current.getAttribute('data-list-index');
                    const swapItem = getByListIndex(items, insertIndex)?.value?.current;
                    
                    if(swapItem){

                        /*if(swapItem.getAnimations().length > 0){
                            return;
                        }
        
                        listItems.forEach(item => {
                            item.value.current.getAnimations().forEach(animation => animation.finish());
                        })*/
                        
                        swapItem.setAttribute('data-list-index', swapIndex);
                        target.current.setAttribute('data-list-index', insertIndex);

                        
                        const {top: swapItemTop} = swapItem.getBoundingClientRect();
        
                        //swapItem.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
                        
                        //console.log('swap in');
                        if(insertIndex !== 0){
                            swapItem.style.transform = getTranslation(swapItem.style.transform, 0, Math.sign(top - swapItemTop) * height);
                        } else {
                            swapItem.style.transform = getTranslation(null, 0, height);
                        }
                    }
                } else {
                    if(target.current.getAttribute('data-list-id')) return;
                    //console.log('swap from out')

                    listItems.filter(item => item.id !== id).forEach(item => {
                        const index = +item.value.current.getAttribute('data-list-index');
                        if(index >= insertIndex){
                            item.value.current.style.transform = getTranslation(item.value.current.style.transform, 0, height);
                            item.value.current.setAttribute('data-list-index', index + 1);
                        } 
                    });

                    target.current.setAttribute('data-list-index', insertIndex);
                    ref.current.style.height = `${ref.current.getBoundingClientRect().height + height}px`;
                }
                
                target.current.setAttribute('data-list-id', listName);
            }
        }
    }), [])

    useEffect(() => {
        dragContext.registerList(listName, context);

        return () => dragContext.removeList(listName);
    }, [])

    const props = useMemo(() => ({forwardedRef: ref, 'data-list-id': listName}), []);

    return (
        <DraggableListContext.Provider 
            value={context}
        >
            {children(props)}
        </DraggableListContext.Provider>
    )
}