import React, {useState, useEffect} from 'react';
import '../styles/Square.css';

function Chat({room, socket, username}) {
    const [msg, setMsg] = useState('');
    const [chat, setChat] = useState([]);
    const [moves, setMoves] = useState([]);


    useEffect(() => {
        socket.on('message', ({name, message, room}) => {
            setChat([...chat, {name, message}])
        })

        socket.on('moveMsg', (msg) => {
            setMoves([...moves, {name: `${msg.piece.color}`, message: `moved ${msg.piece.type} from ${msg.from} to ${msg.to}`}])
        })
    })

    const renderChat = () => {
        return ( 
            chat.map(({name, message}, index) => {
                return (
                    <div key={index}>
                        <p><b>{name}:</b> {message}</p>
                    </div>
                );
            })
        );
    }

    const renderMoves = () => {
        return ( 
            moves.map(({name, message}, index) => {
                let color = index % 2 === 0 ? '#d3d3d3' : 'white'
                return (
                    <div key={index} style={{backgroundColor: color}}>
                        <p><b>{name}:</b> <em>{message}</em></p>
                    </div>
                );
            })
        );
    }

    const handleChange = e => {
        setMsg(e.target.value)
    }

    const onMessageSubmit = e => {
        e.preventDefault();
        socket.emit('message', {name: username, message: msg, room: room});
        console.log(username);
        setMsg('');
    }

    return (
        <div className="chat"> 
            <div className="ui grid">
                <div className="eight wide column">
                    <h2 className="chat">Chat</h2>
                    <hr />
                    <div className="" id="chat">
                        {renderChat()}
                    </div>
                    <form onSubmit={onMessageSubmit}>
                        <div className="field">
                            <input
                                type="text"
                                onChange={e => handleChange(e)}
                                value={msg}
                                label="Message"
                                className="container"
                            />
                            <button className="ui fluid button">Send</button>
                            </div>

                    </form>
                </div>
                <div className="eight wide column chat">
                    <h2 className="chat">Moves</h2>
                    <hr />
                    <div className="">
                        {renderMoves()}
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default Chat;