import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import Board from "./components/Board";




const App = () => {
    
  return (
      <div>
        <h1>Welcome to Linear Chess</h1>
        <Board />
    </div>
  );
};

export default App;
