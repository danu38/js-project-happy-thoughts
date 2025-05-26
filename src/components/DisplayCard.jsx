import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const MessageWrapper = styled.div`
  width: 100%;
  max-width: 800px;
`;

const TextOverflow = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Number of lines to show */
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 400;
  color: #333;
  line-height: 1.5;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
const ThoughtCard = styled(motion.div)`
  margin-bottom: 1rem; /* space between cards */
  padding: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #ffc0cb;
`;

const HeartButton = styled.button`
  background: none;
  background-color: #f8a8d0;
  border: none;
  border-radius: 60%;
  cursor: pointer;
  width: 28px;
  height: 28px;
  color: #be2835; /* Heart color */


    display: flex; /* center the content */
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;flex-direction: row;
`;

const HeartGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 4px; /* space between heart and count */
`;

const HeartCount = styled.span`
  font-size: 1rem;
  line-height: 1;padding-top: 12px;color: #7e7575; /* Heart count color */
`;

const DisplayCard = ({ id, message, time, hearts, onHeart }) => {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return; // Prevent double-tapping
    setIsLiking(true);
    try {
      await fetch(
        `https://happy-thoughts-api-4ful.onrender.com/thoughts/${id}/like`,
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
    <ThoughtCard
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <MessageWrapper>
        <TextOverflow>{message}</TextOverflow>
      </MessageWrapper>

      <CardFooter>
        <HeartGroup>
        
          <HeartButton onClick={handleLike} disabled={isLiking}>
            ❤️
          </HeartButton>{" "}
         <HeartCount>*{hearts}</HeartCount>
        
        </HeartGroup>
        <span>{time}</span>
      </CardFooter>
    </ThoughtCard>
  );
};

export default DisplayCard;
