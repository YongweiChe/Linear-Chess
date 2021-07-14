import React from 'react';
import ListItem from './ListItem';

function Instructions() {

    return (
        <div style={{textIndent: `50px`}}>
            <h2>How to Play</h2>    
            <div className="ui list" >
                <ListItem
                    link="https://upload.wikimedia.org/wikipedia/commons/e/e3/Chess_kdt60.png"
                    piece="The King" 
                    desc="Moves one or two squares, but moving two it may not jump over a piece."
                />
                <ListItem
                    link="https://upload.wikimedia.org/wikipedia/commons/a/a0/Chess_rdt60.png"
                    piece="The Rook" 
                    desc="Moves as usual."
                />
                <ListItem
                    link="https://upload.wikimedia.org/wikipedia/commons/8/81/Chess_bdt60.png"
                    piece="The Bishop" 
                    desc="Moves an even number of squares (i.e., only on squares of his own color), and jumps over squares of the other color."
                />
                <ListItem
                    link="https://upload.wikimedia.org/wikipedia/commons/a/af/Chess_qdt60.png"
                    piece="The Queen" 
                    desc="Has the combined moves of bishop and rook."
                />
                <ListItem
                    link="https://upload.wikimedia.org/wikipedia/commons/f/f1/Chess_ndt60.png"
                    piece="The Knight" 
                    desc="Moves two or three squares, and may jump over other pieces."
                />
                <ListItem
                    link="https://upload.wikimedia.org/wikipedia/commons/c/cd/Chess_pdt60.png"
                    piece="The Pawn" 
                    desc="Moves one square, but may move two on its first move. Takes as it moves."
                />
            </div>
        </div>
    );
}

export default Instructions;