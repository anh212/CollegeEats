import React from 'react';
import Card from '../Card/Card';
import './CardContainer.css';

class CardContainer extends React.Component {
    render() {
        return (
            <div className="justify-center flex">
                <div className="flex flex-wrap pt3 pl3 pr3 ml5 mr5 mt1 inline-flex">
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
            </div>

        );
    }
}

export default CardContainer;
