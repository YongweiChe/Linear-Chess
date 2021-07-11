import React, { useState, useEffect } from 'react';
import Chess from './logic/Chess';
import Board from './Board';

function Game() {
    let game = new Chess();
    console.log(game.getBoard());
    const [board, setBoard] = useState(game.getBoard());

    const random = () => {
        let allMoves = game.getAllMoves(game.getTurn());
        let randMove = Math.floor(Math.random() * allMoves.length);
        game.move(allMoves[randMove].from, allMoves[randMove].to);
        setBoard(game.getBoard());
        console.log(board);
    }
    let aboard = board;
    useEffect(() => {
        aboard = board;
    }, [board]);
    return (
        <div onClick={() => random()}>
            <Board board={aboard}/>
        </div>
    );
}

export default Game;