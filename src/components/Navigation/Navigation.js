import React from 'react';
import './Navigation.css';
import logo from './logo.png'

class Card extends React.Component {
    render() {
        return (
            <div >
                <nav className='navigation'>
                    <img src={logo} className="App-logo" alt="logo" />
                </nav>
            </div>
        );
    }
}

export default Card;
