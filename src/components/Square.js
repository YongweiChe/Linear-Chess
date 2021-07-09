import React from 'react';

class Square extends React.Component {
    render() {
        return (
            <div onClick={() => console.log("hello")}>
                {this.props.piece}
            </div>
        );
    }
}

export default Square;