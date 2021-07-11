import React from 'react';
import Piece from './Piece';
import Empty from './Empty';
import '../styles/Square.css';

function Square({piece, color, selected}) {
    let sqrColor = color ? 'dark' : 'light'
    if (piece) {
        return (
            <div className={`square ${sqrColor}`}><Piece color={piece.color} type={piece.type}/></div>
        );
    }
    return (
        <div className={`square ${sqrColor}`}><Empty /></div>
    )
}

export default Square;