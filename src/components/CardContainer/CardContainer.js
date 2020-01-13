import React from 'react';
import Card from '../Card/Card';
import './CardContainer.css';

class CardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolName: props.schoolName,
            nameLocation: []
        }

        this.getLocations(this.state.schoolName);
    }

    getLocations = (schoolName) => {
        fetch('http://localhost:3000/getLocations/' + schoolName, {
          method: 'get',
          headers: { 'Content-type': 'application/json' },
        })
          .then(response => response.json())
          .then(response => {this.setState({nameLocation: response})})
          .catch(err => console.log(err))
      }

    render() {
        // console.log(this.getLocations(this.state.schoolName));

        return (
            <div className="justify-center ">
                <div className=" flex flex-wrap  pt3 pl3 pr3 ml5 mr5 mt1">
                    {/* <Card schoolName={this.state.schoolName}/>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card /> */}
                    {this.state.nameLocation.map((nameLocation, keyID) => {
                        return <Card diningName={nameLocation.dining_name} locationName={nameLocation.location_name} key={keyID} />
                    })}
                </div>
            </div>

        );
    }
}

export default CardContainer;
