import { useEffect } from "react";
import "../styles/stars.css"; // ✅ Import star animations
import "../styles/buttons.css";

const generateStars = (count = 80) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.animationDuration = `${0.6 + Math.random() * 0.4}s`; // Swift + varied
    stars.push(star);
  }
  return stars;
};

const Home = ({ user, onNavigate, onLogout }) => {
  useEffect(() => {
    const container = document.querySelector(".starry-bg");
    if (container && container.childNodes.length === 0) {
      const stars = generateStars(80);
      stars.forEach((star) => container.appendChild(star));
      return () => stars.forEach((star) => star.remove());
    }
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden px-4">
      {/* 🌌 Starry Background */}
      <div className="starry-bg" />

      {/* 🪐 Main UI */}
      <div className="z-10 text-center space-y-6 p-6 sm:p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl animate-fade-in w-full max-w-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Welcome, {user}!
        </h1>
        <p className="text-white/80 text-sm sm:text-base">
          Your secure vault beneath the stars ✨
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
          <button onClick={onNavigate} className="button-29 w-full sm:w-auto">
            📝 Enter SecureNotes
          </button>
          <button onClick={onLogout} className="button-29 w-full sm:w-auto">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
