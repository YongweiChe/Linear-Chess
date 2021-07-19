import React from 'react';
import '../styles/Square.css';

function Nav() {
    return (
        <div style={{backgroundColor: "	#181818"}}>
            <div className="ui secondary menu">
                <a className="item" style={{color: "white"}} href="/">
                    Home
                </a>
                <a className="item" style={{color: "white"}} href="https://github.com/YongweiChe/Linear-Chess">
                    <i class="github icon"></i>
                </a>
            </div>
        </div>
    );
}

export default Nav;