import { useState } from "react";

function App() {
  const [audio] = useState(new Audio("http://localhost:5000/stream"));

  const play = () => {
    audio.play();
  };

  return (
    <div className="container">
      <div className="player">
        <h2>My-Audio-Player</h2>
        <button onClick={play}>Play Random</button>
      </div>
    </div>
  );
}

export default App;