import React from 'react';
import tp from './assets/transparent.png';

function Empty() {
    return (
            <div className="container"><img className="piece" alt="empty" src={tp}></img></div>
    );
}

export default Empty;