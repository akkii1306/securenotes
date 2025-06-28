import { useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import ProtectedApp from "./components/ProtectedApp";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [view, setView] = useState("home"); // default view after login

  // After logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setView("home");
  };

  // If user not logged in, show Auth
  if (!user) {
    return <Auth onAuth={(username) => {
      setUser(username);
      setView("home");
    }} />;
  }

  return (
    <>
      {view === "home" ? (
        <Home user={user} onNavigate={() => setView("notes")} onLogout={handleLogout} />
      ) : (
        <ProtectedApp user={user} onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;
