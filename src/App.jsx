import { useState } from "react";
import Auth from "./pages/Auth";
import ProtectedApp from "./components/ProtectedApp";

const App = () => {
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  return (
    <>
      {!user ? (
        <Auth onAuth={setUser} />
      ) : (
        <ProtectedApp user={user} onLogout={() => setUser(null)} />
      )}
    </>
  );
};

export default App;
