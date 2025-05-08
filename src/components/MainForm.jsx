// src/components/ThoughtForm.jsx
import { useState } from "react";

const MainForm = ({ onNewThought }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 140;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = message.trim();

    if (trimmed.length < 5 || trimmed.length > maxLength) {
      setError("Message must be between 5 and 140 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Clear previous errors
    try {
      const response = await fetch(
        "https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: trimmed }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.errors?.message?.message ||
            "Something went wrong. Please try again."
        );
        return;
      }

      // Clear form and pass new thought to parent
      setMessage("");
      onNewThought(data);
    } catch (error) {
      setError("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
