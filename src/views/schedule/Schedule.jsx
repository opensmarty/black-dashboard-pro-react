import React from "react";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';

import { graphql, ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {

  Card,
  CardBody,
  UncontrolledTooltip,
  Row,
  Col
} from "reactstrap";
import { FormGroup } from "@material-ui/core";


const DnDCalendar = withDragAndDrop(BigCalendar);

const token = localStorage.getItem('auth-token');
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:3000/graphql',
  headers: {
    authorization: token ? `Bearer ${token}` : "",
  }
});

const localizer = BigCalendar.momentLocalizer(moment);

const getScheduleList = gql`
query getScheduleList($first: Int, $offset: Int) {
	schedules(first: $first, offset: $offset) {
        ScheduleId
        DateSold
        Address  
        City
        StateName
        ZipCode 
        GoogleMaps
        CustomerName
        CustomerPhone  
        Information
        DateWalkthruSchedule
        ProjectManager
        DateWalkthruExecution
        WalkInformation
        ConcretePad
        DateConcretePadScheduled
        DateConcretePadScheduledFinish
        DateConcreteStart
        DateConcreteEnd
        Permit
        Supplier
        Parts
        Equipment
        PathandPaint
        DatePathandPaintStart
        DatePathandPaintEnd
        DateFinalWalkthruScheduled
        ProjectFinalManager
        DateFinalWalkthruExecution
        WalkFinalInformation
   
        executions {
          CustomerName
          City
          ExecutionId
          DateScheduled
          DateScheduledEnd
          DateStart
          DateEnd
          InstallerNote
        }
	}
}
`

const getTeam = gql`
query getTeam($first: Int, $offset: Int) {
	executions(first: $first, offset: $offset) {
    CustomerName
    City
		ExecutionId
		ScheduleId
    DateScheduled
    DateScheduledEnd
    DateStart
    DateEnd
		teams {
			id
			name
			email
		}
	}
}
`
class Schedule extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      events: [
        {
          id: null,
          start: new Date(),
          end: new Date(moment().add(1, "days")),
          title: "Some title"
        }
      ],
      alert: null,
      EventsReturn: [],
      JobSelected: [],
      GroupsUserListInstallerSelected: []

    };
    this.hideAlert = this.hideAlert.bind(this);
    this.getScheduleList = this.getScheduleList.bind(this);
    this.getTeam = this.getTeam.bind(this);
    this.onEventDrop = this.onEventDrop.bind(this);
    this.onEventResize = this.onEventResize.bind(this);
  }

  getScheduleList() {

    client.query({
      query: getScheduleList,
      variables: {},
    }).then(res => {
      var listaSchedule = [res.data];
      for (var i = 0; i < listaSchedule.length; i++) {
        for (var j = 0; j < listaSchedule[i].schedules.length; j++) {
         this.setState({ JobSelected: listaSchedule[i].schedules });
        }
      }
    }).catch(error => {
      this.setState({ msg: error.message });
    });
  }

  getTeam() {
    client.query({
      query: getTeam,
    }).then(res => {
      var listaTeam = [res.data];
      for (var i = 0; i < listaTeam.length; i++) {
        for (var j = 0; j < listaTeam[i].executions.length; j++) {


          this.setState({ EventsReturn: listaTeam[i].executions });

          for (var y = 0; y < listaTeam[i].executions[j].teams.length; j++) {

            this.setState({ GroupsUserListInstallerSelected: listaTeam[i].executions[j].teams })
            
          }
        }
      }
    }).catch(error => {
      this.setState({ msg: error.message });
    });
  }

  componentDidMount() {
    this.getScheduleList();
    this.getTeam();
  }

  selectedEvent(event) {
    console.log(event);
  }

  addNewEventAlert(slotInfo) {
    this.setState({





      alert: (
        <SweetAlert
          input
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Input something"
          onConfirm={(e) => this.addNewEvent(e, slotInfo)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
        />
      )
    });





  }


  //********************  CALENDAR ****************************/

  onEventResize = (type, { event, start, end, allDay }) => {
    this.setState(state => {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: state.events };
    });

    console.log(this.state.events)
  };

  onEventDrop = ({ event, start, end, allDay }) => {
    console.log(start);
  };



  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }









  addNewEvent(e, slotInfo) {
    var newEvents = this.state.events;
    newEvents.push({
      'title': e,
      'start': slotInfo.start,
      'end': slotInfo.end
    })
    this.setState({
      alert: null,
      events: newEvents
    })
  }

  hideAlert() {
    this.setState({
      alert: null
    });
  }

  eventColors(event, start, end, isSelected) {
    var backgroundColor = "event-";
    event.color ? (backgroundColor = backgroundColor + event.color) : (backgroundColor = backgroundColor + "default");
    return {
      className: backgroundColor
    };
  }

  render() {

  const resourceMap = [
    { resourceId: 1, resourceTitle: 'My Schedule ' },
    { resourceId: 2, resourceTitle: 'Ben 10' },
    { resourceId: 3, resourceTitle: 'MAX' },
  ]


    let returnEvents = this.state.EventsReturn.map(function (event) {
      return {
        id: event.ExecutionId,
        title: event.CustomerName + "-" + event.City,
        start: new Date(moment(event.DateScheduled)),
        end: new Date(moment(event.DateScheduledEnd)),
       resourceId: event.ExecutionId,
      };
    })

    return (
      <>
        <div className="content">
          <Row className="mt-12">

            <Col md="12">
              <Card >
                <CardBody>
                  <div>
                    <FormGroup>
                      {this.state.alert}





                      <DnDCalendar
                        selectable
                        localizer={localizer}
                        events={returnEvents}
                        defaultView='month'
                        scrollToTime={new Date(1970, 1, 1, 6)}
                        defaultDate={new Date()}
                        onSelectEvent={event => this.selectedEvent(event)}
                        onSelectSlot={(slotInfo) => this.addNewEventAlert(slotInfo)}
                        eventPropGetter={this.eventColors}

                        onEventDrop={this.onEventDrop}
                        onEventResize={this.onEventResize}
                        resizable
                        style={{ height: "100vh" }}
                      />
                    </FormGroup>
                  </div>
                </CardBody>
              </Card >
            </Col>
          </Row>
        </div>
      </>
    );
  }
}


export default Schedule;
