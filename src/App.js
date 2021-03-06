import React, {useState, useEffect} from "react";
import Board from "./components/Board";
import OfflineBoard from "./components/OfflineBoard"
import Nav from "./components/Nav"
import Instructions from "./components/Instructions"
import Chat from "./components/Chat"
import io from "socket.io-client";

const socket = io("/")

const App = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [playBot, setPlayBot] = useState(false);
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [color, setColor] = useState('black');
    const [depth, setDepth] = useState(2);
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
    else if (playBot) {
        contents = (
            <OfflineBoard color={color} depth={depth}/>
        )
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

        const handleClick = (event) => {
            event.preventDefault();
            setPlayBot(true);
        }

        const handleColor = (event) => {
            setColor(event.target.value);
        }

        const handleDepth = (event) => {
            setDepth(event.target.value);
        }
        contents = (
            <div style={{  textAlign: "center"}}>
                <p  >Glimne's Variant</p>
                <br/>
            <div className="ui grid">
                <div className="ui text container">
                                    <h3>Play Online</h3>
                    <hr />
                    <form className="ui form" onSubmit={handleSubmit}>

                            <div className="field">
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
                            <button className="big fluid ui button primary" type="submit" value="Join">Join</button>
                            </div>
                        <p><b style={{fontSize: '14px', color: 'gray'}}>*the game will start once two people join with the same room code*</b></p>
                    </form>
                    </div>
                    <div className="ui text container" onSubmit={handleClick}>
                        <h3>Play Offline</h3>
                        <hr />

                        <form className="ui form" >
                            <div className="field">
                                <label>
                                    Choose your Side
                                    <select value={color} onChange={handleColor}>
                                        <option value="black">Black</option>
                                        <option value="white">White</option>
                                    </select>
                                </label>
                            </div>
                            <div className="field">
                                <label>
                                    Choose AI Strength
                                    <select value={depth} onChange={handleDepth}>
                                        <option value={2}>LVL 1</option>
                                        <option value={4}>LVL 2</option>
                                    </select>
                                </label>
                            </div>
                            <button className="big fluid ui button negative" type="submit" value="Submit">Play Against an AI</button>
                        </form>
                    </div>
                </div>
            </div>
            
        )
    }
    
    return (
        <div>
            <Nav />
            <h1>Welcome to Linear Chess</h1>
            {contents}
            <br/>
            <hr/>
            <br/>
            
            <Instructions />
        </div>
    );
};

export default App;
