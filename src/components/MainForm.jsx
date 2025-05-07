// src/components/ThoughtForm.jsx
import { useState } from "react";

const MainForm = ({ onNewThought }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const maxLength = 140;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = message.trim();


   if (trimmed.length < 5) {
      setError("Your message is too short! Minimum is 5 characters.");
      return;
    }

    if (trimmed.length > maxLength) {
      setError("Your message is too long! Maximum is 140 characters.");
      return;
    }
    setError(""); // Clear previous errors
    onNewThought(trimmed);
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (error) setError(""); // Clear error on new input
  };

  const remaining = maxLength - message.length;
  const remainingClass = remaining < 0 ? "char-count error" : "char-count";

  return (
    <form onSubmit={handleSubmit} className="thought-form">
      <label htmlFor="message">What’s making you happy right now?</label>
      <textarea
        id="message"
        value={message}
        onChange={handleChange}
        rows="3"
        placeholder="React is making me happy!"
      />

<div className={remainingClass}>
        {remaining} characters remaining
      </div>

      {error && <div className="error-message">{error}</div>}

      <div>
        <button type="submit">❤️ Send Happy Thought ❤️</button>
      </div>
    </form>
  );
};

export default MainForm;