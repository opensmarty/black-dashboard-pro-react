import React from "react";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";

import Calendar from 'react-calendar';
// reactstrap components
import {
  BreadcrumbItem,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  UncontrolledCollapse,
  Label,
  FormGroup,
  Input,
  Row,
  Col,
} from "reactstrap";

class Schedule extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

      DateStart: new Date(),

      //lista todos os schedules
      lista: [],
      teamSelected: [],


      teamScheduled: [],

      //controle modal
      openedCollapses: ["collapseOne"]
    };

    this.setDateStart = this.setDateStart.bind(this);
  }

  setDateStart(evento) {
    this.setState({ DateStart: evento });
    var data = {
      DateStart: this.state.DateStart,
    };

    axios.post('http://localhost:5000/api/schedule/selectByDate/', data)
      //axios.post('https://app-back-obie.herokuapp.com/api/schedule/selectByDate/', data)
      .then(res => {

        this.setState({ lista: [] });
        this.setState({ lista: res.data });


     






      })
      .catch(error => {
        console.log(error);
      });
  }

































  

  setTeamSelected() {
    axios.get('http://localhost:5000/api/schedule/team/')
      .then(res => {
        this.setState({ teamScheduled: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  //Ao abrir a página executará funções
  componentDidMount() {

    this.setTeamSelected();
  
  }

  collapsesToggle = collapse => {
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({
        openedCollapses: []
      });
    } else {
      this.setState({
        openedCollapses: [collapse]
      });
    }
  };

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <ol className="breadcrumb bg-transparent ml-3">
              <BreadcrumbItem>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  Home
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  {" "}
                  Schedule
                </a>
              </BreadcrumbItem>
              <BreadcrumbItem className="active">Plan</BreadcrumbItem>
            </ol>
          </Row>
          <Row>
            <Col>
              <Card >
                <CardBody>
                  <h3>Search Date</h3>
                  <FormGroup>
                    <Calendar
                      start
                      onChange={this.setDateStart}
                      value={this.state.DateStart}
                    />
                  </FormGroup>
                </CardBody>
                <CardHeader>
                  <Col xs={12} md={12}>
                    {
                      this.state.lista.map(function (schedule, index) {

                        return (

                          <blockquote className="blockquote">
                            <h4><b>Job Number: </b> {schedule.ScheduleId}</h4>
                            <h4><b>Name Installer: </b> {schedule.Name}</h4>
                            <h4><b>Date Start: </b> <Moment format="DD-MM-YYYY">{schedule.DateStart}</Moment></h4>
                            <h4><b>Forecast: </b><Moment format="DD-MM-YYYY">{schedule.DateEnd}</Moment></h4>
                            <h4><b>Contact Name: </b> {schedule.ContactName}</h4>
                            <h4><b>Address: </b> {schedule.Address} - {schedule.City} - {schedule.StateDesc}</h4>
                            <Button className="btn-icon btn-simple" color="success" size="sm" href="#collapseExample" id="linkToggler">
                              <i className="fa fa-info"></i>
                            </Button>{' '}
                            <Button className="btn-icon btn-simple" color="success" size="sm" href="#collapseExample" id="linkTogglerInformations">
                              <i className="fa fa-comments"></i>
                            </Button>{' '}
                            {schedule.Ident === 2 &&
                              <Button className="btn-icon btn-simple" color="success" size="sm" href="#collapseExample" id="linkTogglerInformations">
                                <i className="fa fa-barcode"></i>
                              </Button>
                            }
                            <UncontrolledCollapse toggler="#linkToggler,#buttonToggler">
                              <Card>
                                <CardBody>
                                  <h4><b>Job Description:</b> {schedule.JobDescription} </h4>
                                </CardBody>
                              </Card>
                            </UncontrolledCollapse>

                            <UncontrolledCollapse toggler="#linkTogglerInformations,#buttonToggler">
                              <Card>
                                <CardBody>
                                  <h4><b>Job Informations:</b> {schedule.Information} </h4>
                                </CardBody>
                              </Card>
                            </UncontrolledCollapse>
                          </blockquote>

                        );
                      })
                    }
                  </Col>
                </CardHeader>
              </Card >
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Schedule;
