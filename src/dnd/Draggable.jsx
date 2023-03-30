import React, { useCallback, useState, forwardRef, useRef, useEffect, useContext, useLayoutEffect, useMemo} from 'react';
import { DraggableListContext } from './ListContext';
import {v4 as uuid} from 'uuid'

// ref 
export function Draggable({canDrag=true, children}){
    const [startPosition, setStartPosition] = useState(null);
    const ref = useRef(null);
    const draggableListContext = useContext(DraggableListContext);
    const id = useMemo(uuid, []);
    
    useLayoutEffect(() => {
        draggableListContext.registerListItem(id, ref);

        return () => draggableListContext.removeListItem(id);
    }, [])


    useEffect(() => {
        function onDrag(e){
            if(startPosition){
                ref.current.style.transform = `translate(${e.pageX - startPosition.x}px, ${e.pageY - startPosition.y}px)`
            }
        } 

        function onDragExit(e){
            draggableListContext.reportDragEnd(id);
            setStartPosition(null);
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragExit);

        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragExit);
        }
    }, [startPosition])

    
    const startDrag = useCallback((e) => {
        if(!canDrag){
            return;
        }

        draggableListContext.reportDragStart(id);

        setStartPosition({
            x: e.pageX,
            y: e.pageY
        });
    }, [startPosition]);

    const props = useMemo(() => ({ref, onMouseDown: startDrag, 'data-drag-list-id': id, 'data-is-dragged': false }), [])
    
    return children(props);
}