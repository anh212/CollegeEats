import React from 'react';
import Card from '../Card/Card';
import './CardContainer.css';

class CardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolName: this.props.schoolName,
            nameLocations: []
        }
    }

    getLocations = (schoolName) => {
        fetch('http://localhost:3000/getLocations/' + schoolName, {
          method: 'get',
          headers: { 'Content-type': 'application/json' },
        })
          .then(response => response.json())
          .then(response => {this.setState({nameLocations: response})})
          .catch(err => console.log(err))
    }

    componentDidMount() {
        this.getLocations(this.state.schoolName);
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
                    {this.state.nameLocations.map((nameLocation, keyID) => {
                        return <Card schoolName={this.state.schoolName} diningName={nameLocation.dining_name} locationName={nameLocation.location_name} key={keyID} />
                    })}
                </div>
            </div>

        );
    }
}

export default CardContainer;
