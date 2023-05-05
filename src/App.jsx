import Login from "./pages/login/Login";
import Main from "./pages/main/Main.jsx";
import {RouterProvider, createBrowserRouter, useNavigate} from "react-router-dom";
import {useSession, } from '@supabase/auth-helpers-react'


const authenticatedRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    
  },
  {
    path: "app",
    element: <Main />,
  }
]);

const defaultRouter = createBrowserRouter([
  {
    path: "/*",
    element: <Login />,
    
  },
]);



function App() {
  const session = useSession(); 

  return (
      <RouterProvider router={session ? authenticatedRouter : defaultRouter} />
  )
}

export default App
