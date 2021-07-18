import React, {useState, useEffect} from "react";
import Board from "./components/Board";
import Nav from "./components/Nav"
import Instructions from "./components/Instructions"
import Chat from "./components/Chat"
import io from "socket.io-client";

const socket = io("/")

const App = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    let contents;
    if (isConnected) {
        contents = (
            <div>
                <Board room={room} socket={socket} username={username}/>
                <hr/>
                <Chat room={room} socket={socket} username={username}/>
            </div>
        );
    }
    else {
        const handleRoom = (event) => {
            setRoom(event.target.value);
        };

        const handleUsername = (event) => {
            setUsername(event.target.value);
        };

        const handleSubmit = (event) => {
            event.preventDefault();
            socket.emit('join room', {room, username});
            setIsConnected(true);
        };

        contents = (
            <div style={{  textAlign: "center"}}>
                <p  >Glimne's Variant</p>
                <div className="ui text container">
                <form className="ui form" onSubmit={handleSubmit}>

                        <div className="field inp">
                            <label>
                            Enter a Username
                            </label>
                            <input type="text" value={username} onChange={handleUsername} placeholder="Name"/>
                        </div>
                        <div className="field">
                            <label>
                            Create/Join a Game Room
                            </label>
                            <input type="text" value={room} onChange={handleRoom} placeholder="Room Code"/>
                        </div>
                        <div className="field">
                        <button className="big fluid ui button" type="submit" value="Join">Join</button>
                        </div>
                    <p><b style={{fontSize: '14px', color: 'gray'}}>*the game will start once two people join with the same room code*</b></p>
                </form>
                 </div>
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
