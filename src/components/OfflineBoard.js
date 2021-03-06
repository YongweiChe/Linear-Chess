import React, { useState, useEffect} from 'react';
import Square from './Square';
import Chess from '../logic/Chess';
import findMove from '../logic/ChessBot';

import useSound from 'use-sound';
import capture from './assets/capture.mp3';
import move from './assets/move-self.mp3';
import '../styles/Square.css';

function Board(props) {
    const [game, setGame] = useState(new Chess());
    const [isSelected, setIsSelected] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [moves, setMoves] = useState([]);
    const [side, setSide] = useState(() => {
        if (props.color === 'black') {
            // BOT MOVE
            let allMoves = game.getAllMoves(props.color === 'white' ? 'black' : 'white');
            let randMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            setTimeout(() => {
                game.move(randMove.from, randMove.to)
                let movedPiece = game.get(randMove.to);
                let botMove = [...moves, {name: `${movedPiece.color}`, message: `moved ${movedPiece.type} from ${randMove.from} to ${randMove.to}`}];
                setMoves(botMove);
                setIsSelected(true);
                setIsSelected(false);
            }, 1000);
        }
        return props.color;
    });
    const [playCapture] = useSound(
        capture,
        { volume: 0.35 }
    );
    const [playMove] = useSound(
        move,
        { volume: 0.5 }
    );

    useEffect(() => {
        updateBoard();
    })

    const onSelection = async (id) => {
        if (side !== 'spec' &&
            side === game.getTurn() &&
            game.get(selectedSquare) && 
            isSelected && 
            game.get(selectedSquare).color === game.getTurn() &&
            game.moves(selectedSquare).map(sqr => sqr.to).includes(id)) 
        {
            let piece = game.get(selectedSquare);
            let take = game.get(id);
            if (take) playCapture();
            else playMove();
            game.move(selectedSquare, id);
            let movedPiece1 = game.get(id);
            let humanMove;
            if (take) humanMove = [...moves, {name: `${movedPiece1.color}`, message: `moved ${movedPiece1.type} from ${selectedSquare} to ${id}. Captured ${take.type}.`}];
            else humanMove = [...moves, {name: `${movedPiece1.color}`, message: `moved ${movedPiece1.type} from ${selectedSquare} to ${id}.`}];
            setMoves(humanMove);
            if (game.in_checkmate() || game.in_stalemate()) setIsGameOver(true); 
            
            // BOT MOVE
            
            let randMove = findMove(game, props.depth);
            if (game.getMoveCount() === 2) {
                let allMoves = game.getAllMoves(props.color === 'white' ? 'black' : 'white');
                randMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            }
            console.log(randMove);
            console.log(props.depth);
            const wait = await setTimeout(() => {
                if (randMove) {
                    take = game.get(randMove.to);
                    if (take) playCapture();
                    else playMove();
                    game.move(randMove.from, randMove.to);
                    let movedPiece2 = game.get(randMove.to);
                    let botMove;
                    if (take) botMove = [...humanMove, {name: `${movedPiece2.color}`, message: `moved ${movedPiece2.type} from ${randMove.from} to ${randMove.to}. Captured ${take.type}.`}]
                    else botMove = [...humanMove, {name: `${movedPiece2.color}`, message: `moved ${movedPiece2.type} from ${randMove.from} to ${randMove.to}.`}];
                    setMoves(botMove);
                }
                
                if (game.in_checkmate() || game.in_stalemate()) setIsGameOver(true); 
                setIsSelected(true);
                setIsSelected(false);
            }, 1000);

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

    const displayGameOver = () => {
        if (!isGameOver) return <h2></h2>;
        if (game.in_stalemate()) return <h2>||Stalemate||</h2>
        if (game.in_checkmate()) {
            const winner = (game.getTurn() === 'white') ? 'Black' : 'White';
            return <h1><b>||{winner} Wins by Checkmate||</b></h1>
        }
    }       
    

    return (
        <div>
            <div style={{textAlign: "center"}}>
                
                <div className="board">
                    {updateBoard()}
                </div>
                {displayGameOver()}
                <br/>
                <p>it is <b>{`${game.getTurn() === 'white' ? 'White' : 'Black'}`}'s</b> Turn</p>
                <p>
                    <em>[you are playing {side}]</em>
                </p>
            </div>
            <hr ></hr>
            <div className="chat"> 
            <div className="ui grid">
                <div className="eight wide column">
                    <h2>You are Playing: Bot of Depth {props.depth}</h2>
                    <hr />
                    <div>
                        <p>
                            <b>Methodology: </b>
                            <ul>
                            <li>This bot uses the Minimax algorithm and analyzes at a depth of {props.depth}.</li>
                            <li>Alpha-beta pruning is utilized to speed up the computation.</li>
                            <li>The bot's first move is random to provide more variety to the game.</li>
                            </ul>
                        </p>
                    </div>
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
        </div>
        
    );
}

export default Board;
