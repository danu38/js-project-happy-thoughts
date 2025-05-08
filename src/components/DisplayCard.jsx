import React, { useState } from "react";
import { motion } from "framer-motion";

const DisplayCard = ({ id, message, time, hearts, onHeart }) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return; // Prevent double-tapping
    setIsLiking(true);
    try {
      await fetch(
        `https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${id}/like`,
        { method: "POST" }
      );
      onHeart(id); // Tell App to update UI
    } catch (err) {
      console.error("Error liking thought:", err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      className="thought-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <p>{message}</p>
      <div className="card-footer">
      <span><button onClick={handleLike} disabled={isLiking}>
          ❤️ {hearts}
        </button></span>
        <span>{time}</span>
      </div>
    </motion.div>
  );
};

export default DisplayCard;
