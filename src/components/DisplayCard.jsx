const DisplayCard = ({ message, time }) => {
    return (
      <div className="thought-card">
        <p>{message}</p>
        <div className="card-footer">
          <span>❤️ x 0</span>
          <span>{time}</span>
        </div>
      </div>
    );
  };
  
  export default DisplayCard;