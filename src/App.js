import React, {useState, useEffect} from "react";
import Board from "./components/Board";
import Nav from "./components/Nav"
import Instructions from "./components/Instructions"
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
            <div style={{  textAlign: "center"}}>
                <p  >Glimne's Variant</p>
                <form onSubmit={handleSubmit}>
                    <label>
                    Create/Join a Game Room
                    <input type="text" value={room} onChange={handleChange} />
                    </label>
                    <input type="submit" value="Join" />
                    <p><b style={{fontSize: '14px', color: 'gray'}}>*the game will start once two people join with the same room code*</b></p>
                </form>
            </div>
        )
    }

    return (
        <div>
            <Nav />
            <h1>Welcome to Linear Chess</h1>
            {contents}
            <br></br>
            <Instructions />
        </div>
    );
};

export default App;
