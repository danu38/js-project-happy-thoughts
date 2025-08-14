// src/components/ThoughtForm.jsx
import { useState } from "react";

const MainForm = ({ onNewThought }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_LENGTH = 140;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();

    if (trimmed.length < 5 || trimmed.length > MAX_LENGTH) {
      setError("Message must be between 5 and 140 characters.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to post a thought.");
      return;
    }
    setIsSubmitting(true);
    setError(""); // Clear previous errors

    try {
      const response = await fetch(
        "https://js-project-api-zqp9.onrender.com/thoughts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ message: trimmed }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.errors?.message?.message ||
            "Something went wrong. Please try again"
        );
        return;
      }

      // Clear form and pass new thought to parent
      setMessage("");
      onNewThought(data);
    } catch (error) {
      console.error("Error submitting thought:", error);
      setError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (error) setError(""); // Clear error on new input
  };

  const remaining = MAX_LENGTH - message.length;
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

      <div className={remainingClass}>{remaining} characters remaining</div>

      {error && <div className="error-message">{error}</div>}

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "❤️ Send Happy Thought ❤️"}
        </button>
      </div>
    </form>
  );
};

export default MainForm;
