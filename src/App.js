import React, {useState, useEffect} from "react";
import Board from "./components/Board";
import io from "socket.io-client";

const socket = io("http://localhost:3000")

const App = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState('');

    let contents;
    if (isConnected) {
        contents = (
            <Board room={room} socket={socket}/>
        );
    }
    else {
        const handleChange = (event) => {
            setRoom(event.target.value);
        };

        const handleSubmit = (event) => {
            event.preventDefault();
            console.log(room); 
            socket.emit('join room', room);
            setIsConnected(true);
        };

        contents = (
            <div>
                <form onSubmit={handleSubmit}>
                    <label>
                    Create/Join a Room
                    <input type="text" value={room} onChange={handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

    return (
        <div>
            <h1>Welcome to Linear Chess</h1>
            {contents}
        </div>
    );
};

export default App;
