import React, { useState, useEffect } from 'react';
import Square from './Square';
import Chess from '../logic/Chess';
import '../styles/Square.css';

function Board() {
    console.log("here");
    const [game, setGame] = useState(new Chess());
    const [selected, setSelected] = useState(null);

    const updateBoard = () => {
        return game.getBoard().map((sqr, i) => {
            let color = (i % 2 === 0);
            let isSelected = selected === i;
            return (
                <Square piece={sqr} key={i} color={color} selected={isSelected}/>
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
            
    return (
        <div className="board">
            {squares}
            <button onClick={() => randMove()}></button>
        </div>
    );
}

export default Board;


/*
    const random = () => {
        let allMoves = game.getAllMoves(game.getTurn());
        let randMove = Math.floor(Math.random() * allMoves.length);
        game.move(allMoves[randMove].from, allMoves[randMove].to);
        turn++;
        setBoard(game.getBoard());
        console.log(board);
    }
    */