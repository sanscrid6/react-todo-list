import { createContext, useMemo, useState, useRef, useEffect, useContext, useCallback } from "react";
import { getByListIndex, getTranslation, resetStyles, setAttribute, getAttribute, setStyles} from "./utils";
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

export function DraggableListProvider({listName, onDragEnd, children}){
    const [listItems] = useState([]);
    const ref = useRef(null);
    const dragContext = useContext(DragContext);

    const registerListItem = useCallback((id, value, itemData, metaData) => {
        listItems.push({id, value, itemData, metaData});
        value.current.setAttribute('data-list-id', listName);
        value.current.setAttribute('data-list-index', listItems.length - 1);
    })

    const removeListItem = useCallback((id) => {
        const index = listItems.findIndex(item => item.id === id);
        if(index !== -1){
            listItems.splice(index, 1);
        }
    })

    const reportDragStart = useCallback(id => {
        const index = listItems.findIndex(item => item.id === id);
        const target = listItems[index];

        const targetIndexInList = getAttribute(target.value, 'data-list-index')

        setAttribute(target.value, 'data-start-index', targetIndexInList)
        setAttribute(target.value, 'data-start-list-id', listName)
        setAttribute(target.value, 'data-is-dragged', true);

        const {width, height, left, top} = target.value.current.getBoundingClientRect();
        
        const container = ref.current;
        container.style.height = `${container.getBoundingClientRect().height}px`;
       
        listItems
                .slice(index + 1, listItems.length)
                .forEach(({value}) => {
                    value.current.style.transform = getTranslation(null, 0, height);
                });

        setStyles(target, {top, height, left, width})
    })

    const reportDragEnd = useCallback((id, target, data, addNewItem=false) => {
        listItems.forEach(({value, id: itemId}) => {
            if(id !== itemId){
               resetStyles(value)
            }
        })

        ref.current.style = null;
        resetStyles(target);
        setAttribute(target, 'data-is-dragged', false);

        const newItemsRaw = [];
        let outsideListIndex = 0;

        for (const item of listItems) {
            const index = getAttribute(item.value, 'data-list-index');
            const startIndex = getAttribute(item.value, 'data-start-index');

            if(index){
                newItemsRaw[+index + outsideListIndex] = item;
            } else if (startIndex){
                outsideListIndex++;
                newItemsRaw[+startIndex] = item;   
            }
        }

        if(addNewItem){
            const insertIndex = +getAttribute(target, 'data-list-index')
            newItemsRaw[insertIndex] = {
                itemData: {...data},
                metaData: {canDrag: true}
            };
        }

        const newItems = newItemsRaw
                        .filter(item => item.metaData.canDrag)
                        .map(item => ({...item.itemData}))

        onDragEnd(newItems);
    }, []);

    const onDrag = useCallback((id, target) => {
        const overlapingRect = getIntersectionRect(ref.current, target.current);
        
        if(!overlapingRect){
            return;
        }
        
        const {width, height, top} = target.current.getBoundingClientRect();
        
        if(overlapingRect.width < width / 2 || overlapingRect.height < height / 2){
            if(!target.current.hasAttribute('data-list-id') ||
                getAttribute(target, 'data-list-id') !== listName
            ){
                return;
            }

            target.current.removeAttribute('data-list-index');
            target.current.removeAttribute('data-list-id');
            
            listItems
                    .filter(item => item.id !== id)
                    .forEach(({value}, index) => {
                            setAttribute(value, 'data-list-index', index);
                            resetStyles(value);
            })

            const container = ref.current;

            container.style.height = `${container.getBoundingClientRect().height - height}px`;
        }

        if(overlapingRect.width >= width / 2 && overlapingRect.height >= height / 2){
            let insertIndex = null;
            const items = listItems;
            
            for (let i = 0; i < items.length; i++) {
                const {value, id: itemId} = items[i];

                if(itemId !== id){
                    const intercectionWithItem = getIntersectionRect(target.current, value.current);
                    const {height: itemHeight, width: itemWidth} = value.current.getBoundingClientRect();

                    const hasIntercection = intercectionWithItem && 
                                            intercectionWithItem.height > itemHeight / 2 &&
                                            intercectionWithItem.width > itemWidth / 2
                    if(hasIntercection){
                        insertIndex = +getAttribute(value, 'data-list-index');
                        break;
                    }
                } 
            }

            const intercestionRectWithContainer = getIntersectionRect(ref.current, target.current);

            if(items.length === 0){
                insertIndex = 0;
            }

            const hasIndex = target.current.hasAttribute('data-list-index');
            
            if(hasIndex){
                if(insertIndex == null){
                    return;
                }

                const swapIndex = +getAttribute(target, 'data-list-index');
                const swapItem = getByListIndex(items, insertIndex)?.value?.current;
                
                if(swapItem){            
                    swapItem.setAttribute('data-list-index', swapIndex);
                    setAttribute(target, 'data-list-index', insertIndex);
                    
                    const {top: swapItemTop} = swapItem.getBoundingClientRect();
    
                    //console.log('swap in');
                    if(insertIndex !== 0){
                        swapItem.style.transform = getTranslation(
                            swapItem.style.transform,
                            0,
                            Math.sign(top - swapItemTop) * height
                        );

                    } else {
                        swapItem.style.transform = getTranslation(null, 0, height);
                    }
                }
            } else {
                if(getAttribute(target, 'data-list-id')) return;
                //console.log('swap from out')

                const isSwapToEnd = items.length > 0 &&
                                    insertIndex == null &&
                                    intercestionRectWithContainer.width > width / 2 && 
                                    intercestionRectWithContainer.height > height / 2

                if(isSwapToEnd){
                    insertIndex = items.length; 
                }

                if(insertIndex == null){
                    return;
                }

                listItems
                        .filter(item => item.id !== id)
                        .forEach(item => {
                            const index = +getAttribute(item.value, 'data-list-index');
                            if(index >= insertIndex){
                                const nextPos = getTranslation(item.value.current.style.transform, 0, height);
                                item.value.current.style.transform = nextPos;
                                setAttribute(item.value, 'data-list-index', index + 1);
                            } 
                });

                setAttribute(target, 'data-list-index', insertIndex);
                const allItemsHeight = items.reduce(
                    (acc, curr) => acc += curr.value.current.getBoundingClientRect().height,
                    0
                )
                
                ref.current.style.height = `${allItemsHeight + height}px`;
            }
            
            target.current.setAttribute('data-list-id', listName);
        }
    })
    
    const context = useMemo(() => ({
        items: listItems,
        registerListItem,
        removeListItem,
        reportDragStart,
        reportDragEnd,
        onDrag
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