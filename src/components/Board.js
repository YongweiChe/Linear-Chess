import React, { useState, useEffect } from 'react';
import Square from './Square';
import Chess from './logic/Chess';
import './Square.css'

function Board() {
    console.log("here");
    const [game, setGame] = useState(new Chess());
    const [squares, setSquares] = useState(() => {
        return game.getBoard().map((sqr, i) => {
            let color = (i % 2 === 0);
            return (
                <Square piece={sqr} key={i} color={color}/>
            )
        });
    });

    const [move, setMove] = useState(() => {
        console.log("in here");
        return 0;
    });

    const handleMove = () => {
        let allMoves = game.getAllMoves(game.getTurn());
        console.log(game.getTurn());
        let randMove = Math.floor(Math.random() * allMoves.length);
        game.move(allMoves[randMove].from, allMoves[randMove].to);
        setSquares(() => {
            return game.getBoard().map((sqr, i) => {
                let color = (i % 2 === 0);
                return (
                    <Square piece={sqr} key={i} color={color}/>
                )
            });
        });
        setMove(prevMove => prevMove + 1);
        console.log(allMoves);
        console.log(game.getBoard());
    }
            
    return (
        <div className="board">
            {squares}
            <button onClick={() => handleMove()}></button>
            {move}
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