import React, { useCallback, useState, forwardRef, useRef, useEffect, useContext, useLayoutEffect, useMemo} from 'react';
import { DraggableListContext } from './ListContext';
import {v4 as uuid} from 'uuid';
import './Dnd.css';

// ref 
export function Draggable({canDrag=true, itemData, children}){
    const [startPosition, setStartPosition] = useState(null);
    const ref = useRef(null);
    const draggableListContext = useContext(DraggableListContext);
    
    const id = useMemo(uuid, []);

    useLayoutEffect(() => {
        draggableListContext.registerListItem(id, ref, itemData, {canDrag});

        return () => draggableListContext.removeListItem(id);
    }, [itemData, canDrag, id])

    useLayoutEffect(() => {
        function onDrag(e){
            if(startPosition){
                draggableListContext.onDrag(id);
                ref.current.style.transform = 
                    `translate(${e.pageX - startPosition.x}px, ${e.pageY - startPosition.y}px)`
            }
        } 

        function onDragExit(e){
            if(startPosition){
                draggableListContext.reportDragEnd(id);
                setStartPosition(null);
            }
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragExit);
      
        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragExit);
        }
    }, [startPosition, id])
    
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

    const props = useMemo(() => ({ref, onMouseDown: startDrag, 'data-drag-list-id': id, 'data-is-dragged': false }), [itemData])
    
    return children(props);
}