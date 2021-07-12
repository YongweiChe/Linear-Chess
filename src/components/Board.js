import React, { useState} from 'react';
import Square from './Square';
import Chess from '../logic/Chess';
import '../styles/Square.css';

function Board() {
    const [game, setGame] = useState(new Chess());
    const [isSelected, setIsSelected] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);

    const onSelection = (id) => {
        if (game.get(selectedSquare) && 
            isSelected && 
            game.get(selectedSquare).color === game.getTurn() &&
            game.moves(selectedSquare).map(sqr => sqr.to).includes(id)) 
        {
            game.move(selectedSquare, id);
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
                >
                    <Square 
                    piece={sqr} 
                    key={i} 
                    id={i} 
                    color={color} 
                    selected={show} 
                    legal={isLegalMove}
                    />
                </div>
            )
        });
    }
    const [squares, setSquares] = useState(() => {
        return updateBoard();
    });

    const randMove = () => {
        let allMoves = game.getAllMoves(game.getTurn());
        let randMove = Math.floor(Math.random() * allMoves.length);
        game.move(allMoves[randMove].from, allMoves[randMove].to);
        
        setSquares(() => {
            return updateBoard();
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
        <div>
            <div className="board">
                {updateBoard()}
            </div>
            <br/>
            <p>It is {game.getTurn()}'s turn</p>
            {displayGameOver()}
        </div>
    );
}

export default Board;
