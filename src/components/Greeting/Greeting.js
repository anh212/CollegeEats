import React from 'react';
import './Greeting.css';

class Greeting extends React.Component {
  render() {
    return (
      <div className="greeting pa3">
        <div>Hello, where would you like to eat?</div>
      </div>
    );
  }
}

export default Greeting;
