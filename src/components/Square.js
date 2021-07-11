import React from 'react';
import Piece from './Piece';
import Empty from './Empty';
import '../styles/Square.css';

function Square(props) {

    let sqrColor = props.color ? 'dark' : 'light'
    let sqrType = '';
    if (props.selected) sqrType = 'selected';
    if (props.legal) sqrType = 'legal';
    if (props.piece) {
        return (
            <div 
            className={`square ${sqrColor} ${sqrType}`}
            ><Piece color={props.piece.color} type={props.piece.type}/></div>
        );
    }
    return (
        <div className={`square ${sqrColor} ${sqrType}`}><Empty /></div>
    )
}

export default Square;