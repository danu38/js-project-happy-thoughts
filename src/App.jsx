import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
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
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

 
  const [page, setPage] = useState(user ? "thoughts" : "login");// "login", "register", "thoughts"
  // Handle successful login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setPage("thoughts");
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setPage("login");
  };


  const likeCount = likedPostIds.length;

  // 1 Fetch thoughts from API on mount
  useEffect(() => {
      if (page !== "thoughts") return; // Only fetch when on thoughts page
    const fetchThoughts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://js-project-api-zqp9.onrender.com/thoughts"
        );
        const data = await response.json(); // array of thoughts
       setThoughts(data);

        //setThoughts(data); // API returns most recent first
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Could not load thoughts. Try again later.");
      } finally {
        setLoading(false); // setLoading flase since if error occurs i still needs to stoåp the loading spinner
      }
    };

    fetchThoughts();
  }, [page]);

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

  // Page routing
  if (page === "login") {
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setPage("register")} />;
  }

  if (page === "register") {
    return <Register onRegisterSuccess={() => setPage("login")} onSwitchToLogin={() => setPage("login")} />;
  }

    return (
    <div className="app">
      <header>
        <h1>Happy Thoughts</h1>
        {user && (
          <div>
            <span>Logged in as {user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <MainForm onNewThought={addThought} user={user} />

      <p className="like-counter">
        💖 You’ve liked <strong>{likeCount}</strong> different happy thoughts
      </p>
      <button className="thought-form" onClick={resetLikes}>
        🍥 Reset Like Count
      </button>

      {loading && <div className="loading"><p>⏳ Loading happy thoughts...</p></div>}
      {error && <p className="error-message">{error}</p>}

      {thoughts.map((thought) => (
        <DisplayCard
          key={thought._id}
          id={thought._id}
          message={thought.message}
          time={formatDistanceToNow(new Date(thought.createdAt), { addSuffix: true })}
          hearts={thought.hearts}
          onHeart={handleHeart}
        />
      ))}
    </div>
  );
};

export default App;
