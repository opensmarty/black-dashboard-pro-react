import React from "react";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';

import { graphql, ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {
  Badge,
  Card,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col
} from "reactstrap";
import { FormGroup } from "@material-ui/core";


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

class TimelineSchedule extends React.Component {

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
          this.setState({ EventsReturn: listaSchedule[i].schedules[j].executions });
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
    alert(event.title);
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

    let returnEvents = this.state.EventsReturn.map(function (event) {
      return {
        id: event.Execution,
        title: event.CustomerName + "-" + event.City,
        start: new Date(moment(event.DateScheduled)),
        end: new Date(moment(event.DateScheduledEnd)),
        // resourceId: event.ExecutionId,
      };
    })


console.log(this.state.EventsReturn);

    return (
       <>
        <div className="content">
          <div className="header text-center">
            <h3 className="title">Timeline</h3>
          </div>
          <Row>
            <Col md="12">
              <Card className="card-timeline card-plain">
                <CardBody>
                  <ul className="timeline">
                    <li className="timeline-inverted">
                      <div className="timeline-badge danger">
                        <i className="tim-icons icon-planet" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <Badge color="danger" pill>
                            Some Title
                          </Badge>
                        </div>
                        <div className="timeline-body">
                          <p>
                            Wifey made the best Father's Day meal ever. So
                            thankful so happy so blessed. Thank you for making
                            my family We just had fun with the “future” theme
                            !!! It was a fun night all together ... The always
                            rude Kanye Show at 2am Sold Out Famous viewing @
                            Figueroa and 12th in downtown.
                          </p>
                        </div>
                        <h6>
                          <i className="ti-time" />
                          11 hours ago via Twitter
                        </h6>
                      </div>
                    </li>
                    <li>
                      <div className="timeline-badge success">
                        <i className="tim-icons icon-user-run" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <Badge color="success" pill>
                            Another One
                          </Badge>
                        </div>
                        <div className="timeline-body">
                          <p>
                            Thank God for the support of my wife and real
                            friends. I also wanted to point out that it’s the
                            first album to go number 1 off of streaming!!! I
                            love you Ellen and also my number one design rule of
                            anything I do from shoes to music to homes is that
                            Kim has to like it....
                          </p>
                        </div>
                      </div>
                    </li>
                    <li className="timeline-inverted">
                      <div className="timeline-badge info">
                        <i className="tim-icons icon-notes" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <Badge color="info" pill>
                            Another Title
                          </Badge>
                        </div>
                        <div className="timeline-body">
                          <p>
                            Called I Miss the Old Kanye That’s all it was Kanye
                            And I love you like Kanye loves Kanye Famous viewing
                            @ Figueroa and 12th in downtown LA 11:10PM
                          </p>
                          <p>
                            What if Kanye made a song about Kanye Royère doesn't
                            make a Polar bear bed but the Polar bear couch is my
                            favorite piece of furniture we own It wasn’t any
                            Kanyes Set on his goals Kanye
                          </p>
                          <hr />
                        </div>
                        <div className="timeline-footer">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              caret
                              className="btn-round"
                              color="info"
                              data-toggle="dropdown"
                              type="button"
                            >
                              <i className="tim-icons icon-settings-gear-63" />{" "}
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                Action
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                Another action
                              </DropdownItem>
                              <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                              >
                                Something else here
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="timeline-badge warning">
                        <i className="tim-icons icon-gift-2" />
                      </div>
                      <div className="timeline-panel">
                        <div className="timeline-heading">
                          <Badge color="warning" pill>
                            Another One
                          </Badge>
                        </div>
                        <div className="timeline-body">
                          <p>
                            Tune into Big Boy's 92.3 I'm about to play the first
                            single from Cruel Winter also to Kim’s hair and
                            makeup Lorraine jewelry and the whole style squad at
                            Balmain and the Yeezy team. Thank you Anna for the
                            invite thank you to the whole Vogue team
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>

        
    );
  }
}

export default TimelineSchedule;
