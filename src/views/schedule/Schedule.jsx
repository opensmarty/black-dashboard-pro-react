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
  CardText,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Progress,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";


class Schedule extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

      DateStart: new Date(),


      //lista todos os schedules
      lista: [],
      teamSelected: []

    };

    this.setDateStart = this.setDateStart.bind(this);
  }




  setDateStart(evento) {

console.log(moment(evento));


    this.setState({ DateStart: evento });

    var data = {
      DateStart: this.state.DateStart,
    };

    axios.post('https://app-back-obie.herokuapp.com/api/schedule/selectByDate/',    {withCredentials: true}, data)

      .then(res => {
        this.setState({ lista: res.data });
      })
      .catch(error => {
        console.log(error);
      });

  }



  //Retorna schedule cadastrado
  listaSchedule() {
    axios.get('https://app-back-obie.herokuapp.com/api/schedule')
      .then(response => {
        console.log(response.data);
        this.setState({ lista: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Verifica todos os teams selecionados
  verificaAllSelect() {
    axios.get('https://app-back-obie.herokuapp.com/api/schedule/getAllSelected/')
      .then(res => {
        console.log(res.data)
        this.setState({ teamSelected: res.data });

      })
      .catch(error => {
        console.log(error);
      });
  };

  //Ao abrir a página executará funções
  componentDidMount() {

  }




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
                      this.state.lista.map(function (schedule) {
                        return (
                          <blockquote className="blockquote">
                            <h4><b>Contact Name:</b> {schedule.Name}</h4>
                            <h4><b>Date Start:</b> <Moment format="DD-MM-YYYY">{schedule.DateStart}</Moment></h4>
                            <h4><b>Forecast</b><Moment format="DD-MM-YYYY">{schedule.DateEnd}</Moment></h4>
                            <h4><b>Contact Name:</b> {schedule.ContactName}</h4>
                            <h4><b>Address:</b> {schedule.Address} - {schedule.City} - {schedule.StateDesc}</h4>
                            <footer className="blockquote-footer"><b>Job Description:</b> {schedule.JobDescription}</footer>



                            <Button className="btn-icon btn-simple" color="danger" size="sm">
                              <i className="fa fa-eye" />
                            </Button>
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
