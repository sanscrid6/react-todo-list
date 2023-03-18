import React, {useEffect, useState} from "react";


export default function Route({path, children}){
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    function handleNavigation(e){
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('navigate', handleNavigation)

    return () => window.removeEventListener('navigate', handleNavigation);
  }, [])

  return (
    <>
      {currentPath === path && children}
    </>
  );
}
