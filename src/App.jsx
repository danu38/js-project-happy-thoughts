import { useState, useEffect } from "react";
import MainForm from "./components/MainForm";
import DisplayCard from "./components/DisplayCard";
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

  const likeCount = likedPostIds.length;

  // 1 Fetch thoughts from API on mount
  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://happy-thoughts-api-4ful.onrender.com/thoughts"
        );
        const data = await response.json(); // array of thoughts
        setTimeout(() => {
          setThoughts(data);
          setLoading(false);
        }, 1500); // 1.5 seconds , set the loading time to see the loading spinner

        //setThoughts(data); // API returns most recent first
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Could not load thoughts. Try again later.");
      } finally {
        setLoading(false); // setLoading flase since if error occurs i still needs to stoåp the loading spinner
      }
    };

    fetchThoughts();
  }, []);

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

  return (
    <div className="app">
      <MainForm onNewThought={addThought} />

      <p className="like-counter">
        💖 You’ve liked <strong>{likeCount}</strong> different happy thoughts
      </p>
      <button  className="thought-form" onClick={resetLikes}>🍥 Reset Like Count</button>

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
          time={formatDistanceToNow(new Date(thought.createdAt), { addSuffix: true })}
          hearts={thought.hearts}
          onHeart={handleHeart}
        />
      ))}
    </div>
  );
}

export default App;
