import React from 'react';
import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schoolName: this.props.schoolName,
      diningName: this.props.diningName,
      location: this.props.locationName,
      isOpen: null,
      schedule: [],
      description: '',
    }
  }

  //fetches schedule of dining location from database
  getSchedule = (schoolName, diningName) => {
    fetch('http://localhost:3000/getSchedule/' + schoolName + '/' + diningName, {
      method: 'get',
      headers: { 'Content-type': 'application/json' },
    })
      .then(response => response.json())
      .then(response => {
        this.setState({ schedule: response })
      })
      .then(() => {
        let isOpen = this.isOpen(this.state.schedule);
        let description = this.getDescription(this.state.schedule, isOpen);

        this.setState({
          isOpen: isOpen,
          description: description
        })
      })
      .catch(err => console.log(err))
  }

  //Checks if dining location is open/closed
  isOpen = (schedule) => {
    let currentTime = new Date();
    let currentDay = currentTime.getDay();

    //Comparing current day to schedule
    for (let i = 0; i < schedule.length; i++) {
      let day = schedule[i].daynum;

      //If current day matches one of the days in schedule, checks if current time
      //is between the schedule's opening and closing times
      if (day === currentDay) {
        let openingTime = new Date();
        let closingTime = new Date();

        let startTime = parseFloat(schedule[i].starttime);
        let startMinutes = 0;

        let endTime = parseFloat(schedule[i].endtime);
        let endMinutes = 0;

        if (startTime % 1 > 0) {
          startMinutes = (startTime % 1) * 60;
          startTime -= (startTime % 1);
        }

        if (endTime % 1 > 0) {
          endMinutes = (endTime % 1) * 60;
          endTime -= (endTime % 1);
        }

        if (startTime === 24) {
          openingTime.setHours(0, 0, 0);
        } else {
          openingTime.setHours(startTime, startMinutes, 0);
        }

        if (endTime === 24) {
          closingTime.setDate(currentTime.getDate() + 1);
          closingTime.setHours(0, 0, 0);
        } else {
          closingTime.setHours(endTime, endMinutes, 0)
        }

        if (openingTime <= currentTime && currentTime < closingTime) {
          return true;
        }
      }
    }
    return false;
  }

  //Creates string for when dining location will open or closed depending on
  //if location is currently open or closed
  getDescription = (schedule, isOpen) => {
    let description = '';

    let currentTime = new Date();
    let currentDay = currentTime.getDay();
    let currentHour = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();


    if (isOpen) {
      let nextDay = false;

      for (let i = 0; i < schedule.length; i++) {
        let day = schedule[i].daynum;

        if (day === currentDay) {
          //If dining location is closed for the day; starttime and endtime will both be 0
          if (schedule[i].starttime === 0 && schedule[i].endtime === 0) {
            return false;
          }

          let startTime = this.convertToHoursMinutes(parseFloat(schedule[i].starttime));
          let startHour = startTime[0];
          let startMinutes = startTime[1];

          let endTime = this.convertToHoursMinutes(parseFloat(schedule[i].endtime));
          let endHour = endTime[0];
          let endMinutes = endTime[1];

          //Edge case for Hawk's Nest when Sunday morning schedule is last in schedule array
          if (currentHour + (currentMinutes / 60) < parseFloat(schedule[i].starttime)) {
            if (startHour !== 24) {
              if (i === schedule.length) {  //if for loop reaches last element, loop back to beginning
                i = 0;
              }
              continue;
            }
          }

          if (currentHour + (currentMinutes / 60) > parseFloat(schedule[i].endtime)) {
            nextDay = true;
            
            if (i === schedule.length) {  //if for loop reaches last element, loop back to beginning
              i = 0;
            }

            continue;
          }

        
          if (endHour < 24) {
            description += 'Closes ' + (nextDay ? 'tomorrow' : 'today') + ' at ';

            if (endHour === 12) {
              description += (endHour + ':00 PM');
            } else if (endHour > 12) {
              description += ((endHour - 12) + ':' + (endMinutes === 0 ? '00' : endMinutes) + 'PM');
            } else if (endHour < 12) {
              description += (endHour + ':' + (endMinutes === 0 ? '00' : endMinutes) + 'AM');
            }
          } else if (endHour === 24) {
            description += 'Closes tomorrow at 12:00AM';
          }
          nextDay = false;
          return description;

        }
      }
    } else {
      for (let i = 0; i < schedule.length; i++) {
        

        let day = schedule[i].daynum;

        let startHourAndMinute = this.convertToHoursMinutes(parseFloat(schedule[i].starttime));
        let endHourAndMinute = this.convertToHoursMinutes(parseFloat(schedule[i].endtime));

        let startTime = startHourAndMinute[0];
        let startMinutes = startHourAndMinute[1];

        let endTime = endHourAndMinute[0];
        let endMinutes = endHourAndMinute[1];


        if (day === currentDay) {
          //If dining location is closed for the day; starttime and endtime will both be 0
          if (parseFloat(schedule[i].starttime) === 0 && parseFloat(schedule[i].endtime) === 0) {
            return 'Closed today';
          }

          if (currentHour + (currentMinutes / 60) >= parseFloat(schedule[i].endtime)) {

            //When current time is past closing time on current day
            if (i + 1 >= schedule.length) {
              let openHourAndMinutes = this.convertToHoursMinutes(parseFloat(schedule[0].starttime));
              let startHour = openHourAndMinutes[0];
              let startMinutes = openHourAndMinutes[1];

              description += 'Opens tomorrow at ' + startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'AM';
            } else {
              let openHourAndMinutes = this.convertToHoursMinutes(parseFloat(schedule[i + 1].starttime));
              let startHour = openHourAndMinutes[0];
              let startMinutes = openHourAndMinutes[1];

              //need to convert military time to standard time
              description += 'Opens ' + (currentHour < 12 ? 'today' : 'tomorrow') + ' at ';

              if (startHour === 12) {
                description += startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'PM';
              } else if (startHour > 12) {
                description += ((startHour - 12) + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'PM');
              } else if (startHour < 12) {
                description += (startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'AM');
              }
            }
          } else {  //Current time has to be less than start time on current day
            let openHourAndMinutes = this.convertToHoursMinutes(parseFloat(schedule[i].starttime));
            let startHour = openHourAndMinutes[0];
            let startMinutes = openHourAndMinutes[1];

            description += 'Opens today at '; //need to convert military time to standard time
            if (startHour === 12) {
              description += startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'PM';
            } else if (startHour > 12) {
              description += ((startHour - 12) + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'PM');
            } else if (startHour < 12) {
              description += (startHour + ':' + (startMinutes === 0 ? '00' : startMinutes) + 'AM');
            }
          }
          return description;

        }
      }
      //If current day does not matches any of the days in schedule array,
      //then dining location is closed that day
      return 'Closed today'
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

  realTimeUpdateOpenClosed = () => {
    setInterval(() => {
      let isOpen = this.isOpen(this.state.schedule);
      if (isOpen !== this.state.isOpen) {
        this.setState({
          isOpen: isOpen,
          description: this.getDescription(this.state.schedule, isOpen)
        })
      }
    }, 1000)
  }


  componentDidMount() {
    this.getSchedule(this.state.schoolName, this.state.diningName);
    this.realTimeUpdateOpenClosed();
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
