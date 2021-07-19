import React, {useState, useEffect, useRef, useReducer} from 'react';
import '../styles/Square.css';

function Chat({room, socket, username}) {
    const [msg, setMsg] = useState('');
    const [receivedMsg, setReceivedMsg] = useState({name: '', message: ''}); 
    const [receivedMove, setReceivedMove] = useState({from: '', to: '', piece: '', room: ''});
    const chat = useRef([]);
    const moves = useRef([]);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        socket.on('message', ({name, message, room}) => {
            setReceivedMsg({name: name, message: message});
        })

        socket.on('moveMsg', (msg) => {
            setReceivedMove(msg)
        })
    }, [])

    useEffect(() => {
        if (receivedMsg.message !== '') chat.current = [...chat.current, receivedMsg]
        forceUpdate();
    }, [receivedMsg]);

    useEffect(() => {
        if (receivedMove.piece !== '') {
            if (receivedMove.take) moves.current = [...moves.current, {name: `${receivedMove.piece.color}`, message: `moved ${receivedMove.piece.type} from ${receivedMove.from} to ${receivedMove.to}. Captured ${receivedMove.take.type}.`}];
            else moves.current = [...moves.current, {name: `${receivedMove.piece.color}`, message: `moved ${receivedMove.piece.type} from ${receivedMove.from} to ${receivedMove.to}.`}];
            
        }
            forceUpdate();
    }, [receivedMove])

    const renderChat = () => {
        return ( 
            chat.current.map(({name, message}, index) => {
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
            moves.current.map(({name, message}, index) => {
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
                    <h2 >Moves</h2>
                    <hr />
                    <div className="" id="moves">
                        {renderMoves()}
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default Chat;