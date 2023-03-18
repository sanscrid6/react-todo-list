import Login from "./pages/login/Login";
import Main from "./pages/main/Main.jsx";
import Route from "./router/Route";


function App() {
  return (
    <>
      <Route path='/'>
        <Login />
      </Route>
      <Route path='/app'>
        <Main />
      </Route>
    </>
  )
}

export default App
