import React from 'react';
import '../styles/Square.css';

function Nav() {
    return (
        <div style={{backgroundColor: "	#181818"}}>
            <div className="ui secondary menu">
                <a className="item" style={{color: "white"}} href="https://github.com/YongweiChe">
                    Yongwei Che
                </a>
            </div>
        </div>
    );
}

export default Nav;