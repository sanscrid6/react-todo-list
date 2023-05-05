import { useCallback, useState, useRef, useContext, useLayoutEffect, useMemo, useEffect} from 'react';
import { DraggableListContext } from './DraggableListProvider';
import {v4 as uuid} from 'uuid';
import { DragContext } from './DragProvider';

const isTouches = "ontouchstart" in document.documentElement;
const scrollSpeed = 10;

const scrollZone = {
    height: 150
}

function getTransaltionString(x, y){
    return `translate(${x.toFixed(4)}px, ${y.toFixed(4)}px)`
}

export function Draggable({canDrag=true, itemData, children}){
    const [startPosition, setStartPosition] = useState(null);
    const [hasScroll, setHasScroll] = useState(false);

    const draggableListContext = useContext(DraggableListContext);
    const dragContext = useContext(DragContext);

    const ref = useRef(null);
    
    useEffect(() => {
        if (window.innerHeight < document.body.clientHeight) {
            setHasScroll(true);
        } else {
            setHasScroll(false);
        }
    }, [document.body.clientHeight, window.innerHeight])
    
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
                dragContext.onDrag(id, ref);
                
                if(hasScroll){
                    if(isTouches){
                        if(e.targetTouches[0].clientY <= scrollZone.height){
                            window.scroll({top: window.scrollY - scrollSpeed});
                        } else if(e.targetTouches[0].clientY >= window.innerHeight - scrollZone.height){
                            window.scroll({top: window.scrollY + scrollSpeed});
                        }
                    } else {
                        if(e.clientY <= scrollZone.height){
                            window.scroll({top: window.scrollY - scrollSpeed});
                        } else if(e.clientY >= window.innerHeight - scrollZone.height){
                            window.scroll({top: window.scrollY + scrollSpeed});
                        }
                    }  
                }

                if(isTouches){
                    e.preventDefault();
                    ref.current.style.transform = getTransaltionString(
                        e.targetTouches[0].pageX - startPosition.x,
                        e.targetTouches[0].pageY - startPosition.y
                    )
                } else {
                    ref.current.style.transform = getTransaltionString(
                        e.pageX - startPosition.x,
                        e.pageY - startPosition.y
                    )
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
            window.addEventListener('touchmove', onDrag, {passive: false});
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
    }, [startPosition, id, hasScroll])
    
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

    const props = useMemo(
        () => ({
            ref, 
            [`${isTouches ? 'onTouchStart' : 'onDragStart'}`]: startDrag,
            'data-drag-list-id': id,
            'data-is-dragged': false,
            draggable: true
        }), [itemData])
    
    return children(props);
}