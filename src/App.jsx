
import { useState } from "react";

import ThoughtForm from "./components/MainForm";
import ThoughtCard from "./components/DisplayCard";
import "./index.css";

function App() {
  const [thoughts, setThoughts] = useState([]);

  const addThought = (message) => {
    const newThought = {
      id: Date.now(),
      message,
      time: "Just now",
    };
    setThoughts([newThought, ...thoughts]);
  };

  return (
    <div className="app">
      <ThoughtForm onNewThought={addThought} />
      {thoughts.map((thought) => (
        <ThoughtCard key={thought.id} message={thought.message} time={thought.time} />
      ))}
    </div>
  );
}

export default App;