import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter a username");
    localStorage.setItem("user", username.trim());
    onLogin(username.trim());
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/purple-forest.jpg')",
      }}
    >
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md w-full max-w-md border border-white/20 animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-6">🔐 SecureNotes Login</h2>

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
              disabled
              className="w-full bg-white/10 text-white pl-10 pr-4 py-2 rounded-md outline-none border border-white/20 cursor-not-allowed opacity-50"
            />
            <FaLock className="absolute top-2.5 left-3 text-white opacity-50" />
          </div>

          <div className="flex items-center justify-between text-sm text-white/80">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-white" disabled />
              Remember Me
            </label>
            <span className="cursor-pointer hover:underline">Forgot Password</span>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-purple-800 font-bold py-2 rounded hover:bg-gray-100 transition"
          >
            Login
          </button>

          <p className="text-center text-sm text-white/80">
            Don’t have account?{" "}
            <span className="text-white font-semibold hover:underline cursor-pointer">
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
