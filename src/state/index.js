import { createStore, createEvent, sample } from "effector";

export const ITEM_STATUS = Object.freeze({
  TODO: 'TODO',
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE'
})

export const $modalProps = createStore(null);
export const $modalActive = $modalProps.map(modal => modal != null);
export const $todos = createStore({
  [ITEM_STATUS.TODO]: [],
  [ITEM_STATUS.IN_PROGRESS]: [],
  [ITEM_STATUS.DONE]: [],
});

export const openModal = createEvent();
export const closeModal = createEvent();
export const setTodos = createEvent();
export const updateTodos = createEvent();

sample({
  clock: setTodos,
  target: $todos, 
})

sample({
  clock: openModal,
  target: $modalProps
})

sample({
  clock: closeModal,
  fn: () => null,
  target: $modalProps,
})

sample({
  source: $todos,
  clock: updateTodos,
  fn: (todos, {status, items}) => {
    return {
      ...todos, 
      [status]: items,
    }
  },
  target: $todos,
})

