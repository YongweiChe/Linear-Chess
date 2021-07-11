import React from 'react';
import Square from './Square';
import './Square.css'

function Board({board}) {

    let squares = board.map((sqr, i) => {
        let color = (i % 2 === 0);
        return <Square piece={sqr} key={i} color={color}/>
    });

    return (
            <div className="board">
                {squares}
            </div>
    );
}

export default Board;