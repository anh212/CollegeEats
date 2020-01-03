import React from 'react';
import './Card.css';

class Card extends React.Component {
  render() {
    return (
      <div className="card pa3 mb3 mr3">
        <h5 className="diningName mt0 mb2">
          <span className="">Dining Name</span>
          <span className="br-100 mb0 ml2 indicatorLight openPlace"></span>
        </h5>
          <h6 className="mb2 mt0 location">Location</h6>
          <p className="ma0">When does it close: asokfsa[laspd</p>
      </div>
    );
  }
}

export default Card;
