export function useNavigation(){
  return {
    pushState: (path) => {
      window.history.pushState({}, "", path);
      const navigationEvent = new PopStateEvent("navigate");
      window.dispatchEvent(navigationEvent);
    }
  }
}
