
import { motion } from "framer-motion";

const DisplayCard = ({ message, time }) => {
    return (
      <motion.div className="thought-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}>
        <p>{message}</p>
        <div className="card-footer">
          <span>❤️ x 0</span>
          <span>{time}</span>
        </div>
      </motion.div>
    );
  };
  
  export default DisplayCard;