import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Auth = ({ onAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();

    if (!trimmedUser || !password.trim()) {
      return alert("Please enter all fields.");
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (isRegister) {
      if (users[trimmedUser]) {
        alert("Username already exists.");
        return;
      }
      users[trimmedUser] = password;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("user", trimmedUser);
      onAuth(trimmedUser);
    } else {
      if (users[trimmedUser] !== password) {
        alert("Incorrect username or password.");
        return;
      }
      localStorage.setItem("user", trimmedUser);
      onAuth(trimmedUser);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/purple-forest.jpg')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md w-full max-w-md border border-white/20 animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-md outline-none border border-white/20 focus:ring-2 focus:ring-purple-400"
            />
            <FaUser className="absolute top-2.5 left-3 text-white opacity-70" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-md outline-none border border-white/20 focus:ring-2 focus:ring-purple-400"
            />
            <FaLock className="absolute top-2.5 left-3 text-white opacity-70" />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-purple-800 font-bold py-2 rounded hover:bg-gray-100 transition"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p className="text-center text-sm text-white/80">
            {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              className="text-white font-semibold hover:underline cursor-pointer"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
