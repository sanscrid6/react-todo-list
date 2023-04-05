import { useCallback, useState, useRef, useContext, useLayoutEffect, useMemo} from 'react';
import { DraggableListContext } from './DraggableListProvider';
import {v4 as uuid} from 'uuid';
import { DragContext } from './DragProvider';
import { is } from 'effector';

const isTouches = "ontouchstart" in document.documentElement;

export function Draggable({canDrag=true, itemData, children}){
    const [startPosition, setStartPosition] = useState(null);
    const ref = useRef(null);
    const draggableListContext = useContext(DraggableListContext);
    const dragContext = useContext(DragContext);
    
    const id = useMemo(uuid, []);

    useLayoutEffect(() => {
        draggableListContext.registerListItem(id, ref, itemData, {canDrag});
        dragContext.registerListItem(id, ref, itemData, {canDrag});

        return () => {
            draggableListContext.removeListItem(id);
            dragContext.removeListItem(id);
        };
    }, [itemData, canDrag, id])

    useLayoutEffect(() => {
        function onDrag(e){
            if(startPosition){
                //draggableListContext.onDrag(id);
                dragContext.onDrag(id, ref);
                if(isTouches){
                    ref.current.style.transform = 
                    `translate(${e.targetTouches[0].pageX - startPosition.x}px, ${e.targetTouches[0].pageY - startPosition.y}px)`
                } else {
                    ref.current.style.transform = 
                    `translate(${e.pageX - startPosition.x}px, ${e.pageY - startPosition.y}px)`
                }
                
            }
        } 

        function onDragExit(e){
            if(startPosition){
                dragContext.reportDragEnd(id, ref, itemData);
                setStartPosition(null);
            }
        }

        if(isTouches){
            window.addEventListener('touchmove', onDrag);
            window.addEventListener('touchend', onDragExit);
        } else {
            window.addEventListener('mousemove', onDrag);
            window.addEventListener('mouseup', onDragExit);
        }

        
        return () => {
            if(isTouches){
                window.removeEventListener('touchmove', onDrag);
                window.removeEventListener('touchend', onDragExit);
            } else {
                window.removeEventListener('mousemove', onDrag);
                window.removeEventListener('mouseup', onDragExit);
            }
        }
    }, [startPosition, id])
    
    const startDrag = useCallback(async (e) => {
        if(!canDrag){
            return;
        }

        draggableListContext.reportDragStart(id);
        dragContext.reportDragStart(id);
        if(isTouches){
            setStartPosition({
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            });
        } else {
            setStartPosition({
                x: e.pageX,
                y: e.pageY
            });
        }
       
    }, [startPosition]);

    const props = useMemo(() => ({ref, [`${isTouches ? 'onTouchStart' : 'onDragStart'}`]: startDrag, 'data-drag-list-id': id, 'data-is-dragged': false, draggable: true}), [itemData])
    
    return children(props);
}