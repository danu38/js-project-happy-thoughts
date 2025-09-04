import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import MainForm from "./components/MainForm";
import DisplayCard from "./components/DisplayCard";
import Register from "./components/Register";
import Login from "./components/Login";
import { formatDistanceToNow } from "date-fns";
import "./index.css";

export const App = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likedPostIds, setLikedPostIds] = useState(() => {
    const stored = localStorage.getItem("likedPostIds");
    return stored ? JSON.parse(stored) : [];
  });

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // simple toggle for auth screens only
  const [showRegister, setShowRegister] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // new state to avoid flicker

  const [page, setPage] = useState(user ? "thoughts" : "login"); // "login", "register", "thoughts"

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPage("thoughts");
    }
    setAuthLoading(false); // done checking localStorage
  }, []);

  // 1 Fetch thoughts from API on mount
  useEffect(() => {
    if (!user) return;
    const fetchThoughts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://js-project-api-zqp9.onrender.com/thoughts"
        );
        const data = await res.json();
        setThoughts(Array.isArray(data) ? data : data.results || []);
      } catch (e) {
        setError("Could not load thoughts. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchThoughts();
  }, [user]);



  // Handle successful login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const likeCount = likedPostIds.length;

  // 2️.Add new thought (called from MainForm)
  const addThought = (newThought) => {
    // Add to top of list
    setThoughts((prev) => [newThought, ...prev]);
  };

  const handleHeart = (id) => {
    setThoughts((prevThoughts) =>
      prevThoughts.map((thought) =>
        thought._id === id
          ? { ...thought, hearts: thought.hearts + 1 }
          : thought
      )
    );
    setLikedPostIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("likedPostIds", JSON.stringify(updated));
      return updated;
    });
  };

  const resetLikes = () => {
    setLikedPostIds([]);
    localStorage.removeItem("likedPostIds");
  };



   // 5) If NOT logged in → show auth UI only
  if (!user) {
    return showRegister ? (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }
  return (
    <div className="app">
       <header>
        <h1>Happy Thoughts</h1>
        <div>
          <span>Logged in as {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <MainForm onNewThought={addThought} />

      <p className="like-counter">
        💖 You’ve liked <strong>{likeCount}</strong> different happy thoughts
      </p>
      <button className="thought-form" onClick={resetLikes}>
        🍥 Reset Like Count
      </button>

      {loading && (
        <div className="loading">
          <p>⏳ Loading happy thoughts...</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}

      {thoughts.map((thought) => (
        <DisplayCard
          key={thought._id}
          id={thought._id}
          message={thought.message}
          time={formatDistanceToNow(new Date(thought.createdAt), {
            addSuffix: true,
          })}
          hearts={thought.hearts}
          onHeart={handleHeart}
        />
      ))}
    </div>
  );
};

export default App;
