import React, { useState, useEffect} from 'react';
import Square from './Square';
import Chess from '../logic/Chess';
import '../styles/Square.css';

function Board({room, socket, username}) {
    const [game, setGame] = useState(new Chess());
    const [isSelected, setIsSelected] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [side, setSide] = useState('white');

    useEffect(() => {
        let player = 100;
        let players = 1;

        socket.emit('boardRequest', {room, username});

        socket.on('boardRequest', function({room, username}) {
            console.log("received request");
            if (players === 1) player = 1;
            players++;
            socket.emit('boardSend', {game: game.getGameState(), room: room, side: side, players: players});
        });

        socket.on('boardSend', function(info) {
            players = info.players;
            game.importGameState(info.game);
            onSelection(0);
            setIsSelected(false);
            if (players <= 2) {
                player = info.players
                setSide(info.side === 'white' ? 'black' : 'white'); 
            }
            else if (player > 2 ) setSide('spec');
        }); 

        socket.on('move', function(msg) {
            game.move(msg.from, msg.to);
            updateBoard();
            if (game.in_checkmate()) setIsGameOver(true); 
            if (game.in_stalemate()) setIsGameOver(true); 
            onSelection(msg.to);
            setIsSelected(false);
        });
    }, []);

    useEffect(() => {
        updateBoard();
    })

    const onSelection = (id) => {
        if (side !== 'spec' &&
            side === game.getTurn() &&
            game.get(selectedSquare) && 
            isSelected && 
            game.get(selectedSquare).color === game.getTurn() &&
            game.moves(selectedSquare).map(sqr => sqr.to).includes(id)) 
        {
            let piece = game.get(selectedSquare);
            game.move(selectedSquare, id);
            socket.emit('move', ({from: selectedSquare, to: id, piece: piece, room: room}));

            if (game.in_checkmate()) setIsGameOver(true); 
            if (game.in_stalemate()) setIsGameOver(true); 

            setIsSelected(false);
        }
        else if (game.get(id)){
            setIsSelected(() => {
                if (!isSelected) return true;
                if (isSelected && id === selectedSquare) return false;
                return true;
            });
            setSelectedSquare(id);
        }
    }
    
    // DRAG AND DROP FUNCTIONALITY
    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e, i) => {
        e.preventDefault();
        e.stopPropagation();
        onSelection(i);
    };

    const handleDrag = (i) => {
        setIsSelected(true);
        setSelectedSquare(i);
    }

    const updateBoard = () => {
        let legalMoves = [];
        if (isSelected && game.get(selectedSquare)) legalMoves = game.moves(selectedSquare).map(move => {
            return move.to;
        });
        return game.getBoard().map((sqr, i) => {
            let color = (i % 2 === 0);
            let show = (selectedSquare === i) && isSelected;
            let isLegalMove = legalMoves.includes(i);
            return (
                <div
                key={i} 
                className="squareContainer" 
                onClick={() => onSelection(i)}
                onDrop={e => handleDrop(e, i)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
                >
                    <Square 
                    piece={sqr} 
                    key={i} 
                    id={i} 
                    color={color} 
                    selected={show} 
                    legal={isLegalMove}
                    dragging={handleDrag}
                    />
                    <br/>
                    <em>{i}</em>
                </div>

            )
        });
    }


    const displayGameOver = () => {

        if (!isGameOver) return <h2></h2>;
        if (game.in_stalemate()) return <h2>!!! Stalemate !!!</h2>
        if (game.in_checkmate()) {
            const winner = (game.getTurn() === 'white') ? 'black' : 'white';
            return <h2>!!! {winner} Won !!!</h2>
        }
    }       
    

    return (
        <div style={{textAlign: "center"}}>
            <p>Your Room: <em>{room}</em></p>
            <div className="board">
                {updateBoard()}
            </div>
            <br/>
            <p>it is <b>{`${game.getTurn() === 'white' ? 'White' : 'Black'}`}'s</b> Turn</p>
            <p>
                <em>[you are playing {side}]</em>
            </p>
            {displayGameOver()}
        </div>
    );
}

export default Board;
