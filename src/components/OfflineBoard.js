import React, { useState, useEffect} from 'react';
import Square from './Square';
import Chess from '../logic/Chess';
import '../styles/Square.css';

function Board(props) {
    const [game, setGame] = useState(new Chess());
    const [isSelected, setIsSelected] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [side, setSide] = useState(() => {
        if (props.color === 'black') {
            // BOT MOVE
            let allMoves = game.getAllMoves(props.color === 'white' ? 'black' : 'white');
            let randMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            setTimeout(() => {
                game.move(randMove.from, randMove.to)
                setIsSelected(true);
                setIsSelected(false);
            }, 1000);
        }
        return props.color;
    });

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
            game.move(selectedSquare, id);
            if (game.in_checkmate()) setIsGameOver(true); 
            if (game.in_stalemate()) setIsGameOver(true); 

            // BOT MOVE
            let allMoves = game.getAllMoves(side === 'white' ? 'black' : 'white');
            let randMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            const wait = await setTimeout(() => {
                game.move(randMove.from, randMove.to)
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
            <p>NOTE: This is a placeholder bot that makes random legal moves. The real AI is currently being developed.</p>
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
