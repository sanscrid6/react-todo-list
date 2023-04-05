import { createContext, useState, useMemo } from "react";

export const DragContext = createContext({
    items: [],
    registerListItem: (id, ref, itemData, metaData) => {},
    removeListItem: (id) => {},
    onDrag: (id, ref) => {}, 
    reportDragEnd: (id, ref, data) => {},
    registerList: (id, context) => {},
    removeList: (id) => {}
});


export function DragProvider({children}){
    const [items] = useState([]);
    const [dragLists] = useState([]);


    const context = useMemo(() => ({
        registerListItem: (id, value, itemData, metaData) => {
            items.push({id, value, itemData, metaData});
        },
        removeListItem: (id) => {
            const index = items.findIndex(item => item.id === id);
            if(index !== -1){
                items.splice(index, 1);
            }
        },
        reportDragStart: id => {
            items.forEach(item => {
                item.value.current.style.pointerEvents = 'none';
            })
        },
        registerList: (id, context) => {
            dragLists.push({id, context});
        },
        removeList: (id) => {
            const index = dragLists.findIndex(item => item.id === id);
            if(index !== -1){
                dragLists.splice(index, 1);
            }
        },
        onDrag: (id, ref) => {
            dragLists.forEach(({context}) => {
                context.onDrag(id, ref);
            })
        },
        reportDragEnd: (id, ref, data) => {
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
            })
        }
    }), [])


    return (
        <DragContext.Provider value={context}>
            {children}
        </DragContext.Provider>
    )
}