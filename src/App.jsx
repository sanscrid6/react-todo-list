import Login from "./pages/login/Login";
import Main from "./pages/main/Main.jsx";
import {RouterProvider, createBrowserRouter} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    
  },
  {
    path: "app",
    element: <Main />,
  }
]);



function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
