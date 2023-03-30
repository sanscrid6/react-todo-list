import { createContext, useMemo, useState, useRef } from "react";

export const DraggableListContext = createContext({
    items: [],
    registerListItem: (id, ref) => {},
    removeListItem: (id) => {},
    reportDragStart: (id) => {},
    reportDragEnd: (id) => {},
    onDrag: (id) => {} 
});

export function DraggableListProvider({children}){
    const [listItems, setListItems] = useState([]);
    const ref = useRef(null);

    const context = {
        items: listItems,
        registerListItem: (uuid, ref) => listItems.push({id: uuid, value: ref}),
        removeListItem: (id) => {
            const index = listItems.findIndex(item => item.id === id);
            if(index !== -1){
                listItems.splice(index, 1);
            }
        },
        reportDragStart: id => {
            const index = listItems.findIndex(item => item.id === id);
            const target = listItems[index];
            const {width, height, left, top} =  target.value.current.getBoundingClientRect();
           
            listItems.slice(index + 1, listItems.length).forEach(({value, id: itemId}) => {
                value.current.style.transform = `translate(${0}px, ${height}px)`
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
            listItems.forEach(({value, id}) => {
                value.current.style = null;
                value.current.setAttribute('data-is-dragged', false);
            })
        }
    }

    const props = useMemo(() => ({forwardedRef: ref}), []);

    return (
        <DraggableListContext.Provider 
            value={context}
        >
            {children(props)}
        </DraggableListContext.Provider>
    )
}