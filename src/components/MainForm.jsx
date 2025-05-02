// src/components/ThoughtForm.jsx
import { useState } from "react";

const MainForm = ({ onNewThought }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length < 5 || message.trim().length > 140) {
      alert("Message must be between 5 and 140 characters");
      return;
    }
    onNewThought(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="thought-form">
      <label htmlFor="message">What’s making you happy right now?</label>
      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="3"
        placeholder="React is making me happy!"
      />
      <div>
        <button type="submit">❤️ Send Happy Thought ❤️</button>
      </div>
    </form>
  );
};

export default MainForm;