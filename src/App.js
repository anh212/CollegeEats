import React from 'react';
// import logo from './logo.png';
import './App.css';
// import Background from './components/Background/Background';
import Navigation from './components/Navigation/Navigation';
import CardContainer from './components/CardContainer/CardContainer';
import Greeting from './components/Greeting/Greeting';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      schoolName: 'lehigh'
    }
  }

  render() {
    return (
      <div className="App">
        {/* <Background /> */}
        <Navigation />
        <Greeting />
        <CardContainer schoolName={this.state.schoolName}/>

        {/* <div className="App-header">

        </div> */}
      </div>
    );
  }
}

export default App;

//FIGURE OUT HOW TO CHANGE BODY BACKGROUND COLOR
