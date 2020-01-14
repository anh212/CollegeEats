import React from 'react';
import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolName: this.props.schoolName,
      diningName: this.props.diningName,
      location: this.props.locationName,
      isOpen: true,
      schedule: [],
      description: '',
    }
  }

  getSchedule = (schoolName, diningName) => {
    fetch('http://localhost:3000/getSchedule/' + schoolName + '/' + diningName, {
          method: 'get',
          headers: { 'Content-type': 'application/json' },
        })
          .then(response => response.json())
          .then(response => {
            console.log(response)
            this.setState({schedule: response})})
            .then(() => {
              let isOpen = this.isOpen(this.state.schedule);
              console.log(this.state.schedule.length)
              let description = this.getClosingDescription(this.state.schedule, this.state.isOpen);
          
              this.setState({
                isOpen: isOpen,
                description: description
              })
            })
          .catch(err => console.log(err))
  }

  isOpen = (schedule) => {
    let currentTime = new Date();
    let currentDay = currentTime.getDay();
    // let currentHour = date.getHours();
    // let currentMinutes = date.getMinutes();

    // console.log(day + hour)

    for (let i = 0; i < schedule.length; i++) {
      let day = schedule[i].daynum;

      if (day === currentDay) {
        let openingTime = new Date();
        let closingTime = new Date();
  
        let startTime = schedule[i].starttime;
        let startMinutes = 0;
  
        let endTime = schedule[i].endtime;
        let endMinutes = 0;
  
        if (startTime % 1 > 0) {
          startMinutes = (startTime % 1) * 60;
          startTime -= (startTime % 1);
        }
  
        if (endTime % 1 > 0) {
          endMinutes = (endTime % 1) * 60;
          endTime -= (endTime % 1);
        }

        openingTime.setHours(startTime, startMinutes, 0);
        closingTime.setHours(endTime, endMinutes, 0)

        if (endTime === 24) {
          closingTime.setDate(closingTime.getDate() + 1);
          closingTime.setHours(0,0,0);
        }

        if (openingTime <= currentTime && currentTime < endTime) {
          return true;
        }
      }
    }
    
    return false;
  }

  getClosingDescription = (schedule, isOpen) => {
    let description = '';

    let currentTime = new Date();
    let currentDay = currentTime.getDay();


    for (let i = 0; i < schedule.length; i++) {
      let day = schedule[i].daynum;
      console.log(day)
      if (day === currentDay) {

        let endTime = schedule[i].endtime;
        console.log(endTime)

        if (endTime < 24) {
          description += 'Closes today at ';

          if (endTime === 12) {
            description += (endTime + ':00 PM');
          } else if (endTime > 12) {
            description += ((endTime - 12) + ':00 PM');
          } else if (endTime < 12) {
            description += (endTime + ':00 AM');
          }
        } else if (endTime === 24) {
          description += 'Closes tomorrow at 12:00AM';
        }
    }
    return description;
  }
}

  componentDidMount() {
    this.getSchedule(this.state.schoolName, this.state.diningName);
  }

  render() {
    return (
      <div className="card pa3 mb3 mr3">
        <h5 className="diningName mt0 mb2">
          <span className="">{this.state.diningName}</span>
          <span className={"br-100 mb0 ml2 indicatorLight " + (this.state.isOpen ? 'open' : 'closed')}></span>
        </h5>
        <h6 className="mb2 mt0 location">{this.state.location}</h6>
    <p className="ma0">{this.state.description}</p>
      </div>
    );
  }
}

export default Card;
