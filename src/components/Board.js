import React from 'react';
import Square from './Square';

class Board extends React.Component {
    constructor(props) {
        super(props);
        const startingPos = ["king", "king", "king","king","king","king","king","king","king",];
        this.state = { 
            moves: 0,
            squares: startingPos,
            whiteTurn: true
        };
    }

    componentDidMount() {
        
        this.setState((state, props) => {
            return (
                {moves: 1}
            );
        })
    }

    render() {

        return (
            <div>
                {this.state.squares.map((square, index) => {
                    return (
                    <Square key={index} piece={square} />)
                    ;
                })}
            </div>
        );
    }
}

export default Board;