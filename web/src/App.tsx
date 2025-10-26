import Home from "./components/home";
import HomeLogOut from "./components/home_logout";
import { Toaster } from "./components/ui/sonner";
import useAuth from "./hooks/useAuth";

function App() {
  const { logged } = useAuth();
  return (
    <div className="bg-gradient-to-b from-zinc-950 to-black text-white">
      {logged ? <Home /> : <HomeLogOut />}
      <Toaster />
    </div>
  );
}

export default App;
