import React from 'react';

function ListItem({link, piece, desc}) {

    return (
        <div className="item" >
                    <img className="ui avatar image" src={link}/>
                    <div className="content" style={{textIndent: `0px`}}>
                    <p className="header">{piece}</p>
                    <div className="description">{desc}</div>
                    </div>
                </div>
    );
}

export default ListItem;