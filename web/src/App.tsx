import Home from "./components/home";
import HomeLogOut from "./components/home_logout";
import useAuth from "./hooks/useAuth";

function App() {
  const { logged } = useAuth();
  return (
    <div className="bg-gradient-to-b from-slate-950 to-black text-white">
      {logged ? <Home /> : <HomeLogOut />}
    </div>
  );
}

export default App;
