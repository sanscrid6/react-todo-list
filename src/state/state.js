import {useEffect, useState} from "react";

export function createStore(initial){
  let value = initial;

  const subscribers = new Set();

  return {
    get: () => value,
    set: (v) => {
      value = v;
      subscribers.forEach(s => s(value))
    },
    subscribe: (listener) => {
      subscribers.add(listener);
    }
  }
}

export function useStore({get, set, subscribe}){
  const [value, setValue] = useState(get());

  useEffect(() => {
    subscribe(v => setValue(v))
  }, [])

  return value;
}
