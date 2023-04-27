import { createContext, useState, useMemo, useCallback } from "react";

export const DragContext = createContext({
    items: [],
    registerListItem: (id, ref, itemData, metaData) => {},
    removeListItem: (id) => {},
    onDrag: (id, ref) => {}, 
    reportDragEnd: (id, ref, data) => {},
    registerList: (id, context) => {},
    removeList: (id) => {}
});


export function DragProvider({children, onDragEnd}){
    const [items] = useState([]);
    const [dragLists] = useState([]);

    const registerListItem = useCallback((id, value, itemData, metaData) => {
        items.push({id, value, itemData, metaData});
    }, [])

    const removeListItem = useCallback((id) => {
        const index = items.findIndex(item => item.id === id);
        if(index !== -1){
            items.splice(index, 1);
        }
    }, [])

    const reportDragStart = useCallback(id => {
        items.forEach(item => {
            item.value.current.style.pointerEvents = 'none';
        })
    }, [])

    const registerList = useCallback((id, context) => {
        dragLists.push({id, context});
    }, [])

    const removeList = useCallback((id) => {
        const index = dragLists.findIndex(item => item.id === id);
        if(index !== -1){
            dragLists.splice(index, 1);
        }
    }, [])

    const onDrag = useCallback((id, ref) => {
        dragLists.forEach(({context}) => {
            context.onDrag(id, ref);
        })
    }, [])

    const reportDragEnd = useCallback((id, ref, data) => {
        const currentList = dragLists.find(list => list.id === ref.current.getAttribute('data-list-id'));
        const startList = dragLists.find(list => list.id === ref.current.getAttribute('data-start-list-id'));
        
        if(currentList && currentList !== startList){
            currentList.context.reportDragEnd(id, ref, data, true);
            startList.context.removeListItem(id);
            startList.context.reportDragEnd(id, ref, data);
        } else if(currentList === startList){
            startList.context.reportDragEnd(id, ref, data)
        } else if(startList) {
            startList.context.reportDragEnd(id, ref, data)
        } 

        setTimeout(() => {
            items.forEach(item => {
                item.value.current.style.pointerEvents = '';
            })

            const newItems = dragLists.reduce((acc, {id, context}) => ({
                    ...acc,
                    [id]: context.items.filter(item => item.metaData.canDrag).map(item => item.itemData)
            }), {})

            onDragEnd && onDragEnd(newItems);
        })
    }, [])


    const context = useMemo(() => ({
        registerListItem,
        removeListItem,
        reportDragStart,
        registerList,
        removeList,
        onDrag,
        reportDragEnd
    }), [])


    return (
        <DragContext.Provider value={context}>
            {children}
        </DragContext.Provider>
    )
}