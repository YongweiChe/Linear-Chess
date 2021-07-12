import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Board from "./components/Board";


const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })

    socketRef.current.on("message", (message) => {
      console.log("here");
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
    };
    setMessage("");
    socketRef.current.emit("send message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
      <div>
        <h1>Welcome to Linear Chess</h1>
        <Board />
        <div className="ui comments">
            {messages.map((message, index) => {
            if (message.id === yourID) {
                return (
                <div key={index}>
                    {message.body}
                </div>
                )
            }
            return (
                <div key={index}>
                    {message.body}
                </div>
            )
            })}
        <form onSubmit={sendMessage}>
            <input type="text" value={message} onChange={handleChange} placeholder="Say something..." />
            <button>Send</button>
        </form>
        </div>
    </div>
  );
};

export default App;
