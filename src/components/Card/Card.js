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
        // console.log(response)
        this.setState({ schedule: response })
      })
      .then(() => {
        let isOpen = this.isOpen(this.state.schedule);
        // console.log(this.state.schedule.length)
        let description = this.getDescription(this.state.schedule, this.state.isOpen);
        // console.log(description)

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
          closingTime.setHours(0, 0, 0);
        }

        // console.log(openingTime)
        // console.log(currentTime)
        // console.log(closingTime)

        if (openingTime <= currentTime && currentTime < closingTime) {
          return true;
        }
      }
    }

    return false;
  }

  getDescription = (schedule, isOpen) => {  //FIX
    let description = '';

    let currentTime = new Date();
    let currentDay = currentTime.getDay();
    let currentHour = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();


    if (isOpen) {
      for (let i = 0; i < schedule.length; i++) {
        let day = schedule[i].daynum;
        // console.log(day)
        // console.log(currentDay)
        if (day === currentDay) {

          let endTime = this.convertToHoursMinutes(parseFloat(schedule[i].endtime));
          let hour = endTime[0];
          let minutes = endTime[1];

          console.log(currentHour + (currentMinutes / 60))

          let nextDay = false;

          if (currentHour + (currentMinutes / 60) > parseFloat(schedule[i].endtime)) {
            nextDay = true;
            continue;
          }

          console.log(schedule[i])

          if (hour < 24) {
            description += 'Closes ' + (nextDay ? 'tomorrow' : 'today') + ' at ';

            if (hour === 12) {
              description += (hour + ':00 PM');
            } else if (hour > 12) {
              description += ((hour - 12) + ':' + (minutes === 0 ? '00' : minutes) + 'PM');
            } else if (hour < 12) {
              description += (hour + ':' + (minutes === 0 ? '00' : minutes) + 'AM');
            }
          } else if (hour === 24) {
            description += 'Closes tomorrow at 12:00AM';
          }
          return description;

        }
      }
    } else {
      for (let i = 0; i < schedule.length; i++) {
        let day = schedule[i].daynum;
        console.log(day + currentDay)

        let startHourAndMinute = this.convertToHoursMinutes(schedule[i].starttime);
        let endHourAndMinute = this.convertToHoursMinutes(schedule[i].endtime);

        let startTime = startHourAndMinute[0];
        let startMinutes = startHourAndMinute[1];

        let endTime = endHourAndMinute[0];
        let endMinutes = endHourAndMinute[1];

        if (day === currentDay) {
          if (currentHour >= endTime) {

            //When current time is past closing time on current day
            if (i + 1 >= schedule.length) {
              let openHourAndMinutes = this.convertToHoursMinutes(schedule[0].starttime);
              let startHour = openHourAndMinutes[0];
              let startMinutes = openHourAndMinutes[1];

              description += 'Opens tomorrow at ' + startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'AM';
            } else {
              let openHourAndMinutes = this.convertToHoursMinutes(schedule[i + 1].starttime);
              let startHour = openHourAndMinutes[0];
              let startMinutes = openHourAndMinutes[1];

              description += 'Opens ' + (currentHour < 12 ? 'today' : 'tomorrow') + 'at' + startHour + ':' + (startMinutes === 0 ? '00' : startMinutes); //need to convert military time to standard time

              if (startHour === 12) {
                description += (startHour + 'PM');
              } else if (startHour > 12) {
                description += ((startHour - 12) + 'PM');
              } else if (startHour < 12) {
                description += (startHour + 'AM');
              }
            }
          } else {  //Current time has to be less than start time on current day
            let openHourAndMinutes = this.convertToHoursMinutes(schedule[i].starttime);
            let startHour = openHourAndMinutes[0];
            let startMinutes = openHourAndMinutes[1];


            description += 'Opens today at'; //need to convert military time to standard time
            
            if (startHour === 12) {
              description += startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'PM';
            } else if (startHour > 12) {
              description += ((startHour - 12) + (startMinutes === 0 ? '00' : startMinutes) + 'PM');
            } else if (startHour < 12) {
              description += (startHour + (startMinutes === 0 ? '00' : startMinutes) + 'AM');
            }
          }
          return description;
        }

        // if (currentDay.getDay() < day) {
        //   let startTime = schedule[i].starttime;
        //   let startMinutes = 0;

        //   if (startTime % 1 > 0) {
        //     startMinutes = (startTime % 1) * 60;
        //     startTime -= (startTime % 1);
        //   }

        //   description += 'Opens tomorrow at ' + startTime + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'AM';
        // } else {

        // }


        // let openingTime = new Date();

        // let startTime = schedule[i].starttime;
        // let startMinutes = 0;

        // if (startTime % 1 > 0) {
        //   startMinutes = (startTime % 1) * 60;
        //   startTime -= (startTime % 1);
        // }

        // closingTime.setHours(endTime, endMinutes, 0)

        // if (endTime === 24) {
        //   closingTime.setDate(closingTime.getDate() + 1);
        //   closingTime.setHours(0, 0, 0);
        // }
      }

    }

  }

  convertToHoursMinutes = (time) => {
    let newTime = time;
    let minutes = 0;

    if (newTime % 1 > 0) {
      minutes = (newTime % 1) * 60;
      newTime -= (newTime % 1);
    }

    return [newTime, minutes];
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
