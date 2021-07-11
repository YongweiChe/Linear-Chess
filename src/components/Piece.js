import React from 'react';
import bk from './assets/black-king.png';
import bq from './assets/black-queen.png';
import br from './assets/black-rook.png';
import bb from './assets/black-bishop.png';
import bkn from './assets/black-knight.png';
import bp from './assets/black-pawn.png';
import wk from './assets/white-king.png';
import wq from './assets/white-queen.png';
import wr from './assets/white-rook.png';
import wb from './assets/white-bishop.png';
import wkn from './assets/white-knight.png';
import wp from './assets/white-pawn.png';

function Piece({color, type}) {
    let pieces = {
        blackking: bk,
        blackqueen: bq,
        blackrook: br,
        blackbishop: bb,
        blackknight: bkn,
        blackpawn: bp,
        whiteking: wk,
        whitequeen: wq,
        whiterook: wr,
        whitebishop: wb,
        whiteknight: wkn,
        whitepawn: wp,
    }
    return (
            <div className="container grab" onClick={() => console.log(type)}><img className="piece" alt="piece" src={pieces[`${color}${type}`]}></img></div>
    );
}


export default Piece;
