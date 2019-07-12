import React from "react";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";


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
      //lista todos os schedules
      lista: [],
      teamSelected: []
    };
  }

  //Retorna schedule cadastrado
  listaSchedule() {
    axios.get('http://localhost:8080/api/schedule')
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
    axios.get('http://localhost:8080/api/schedule/getAllSelected/')
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
    this.listaSchedule();
    this.verificaAllSelect();
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

            <Col xs={12} md={12}>

              {
                this.state.lista.map(function (schedule) {
                  return (
                    <blockquote className="blockquote">        
                      <h3><b>Date:</b> <Moment format="MM-DD-YYYY">{schedule.Date}</Moment></h3>
                      <h4><b>Name:</b> {schedule.Name}</h4>
                      <h4><b>Contact Name:</b> {schedule.ContactName}</h4>
                      <h4><b>Address:</b> {schedule.Address} - {schedule.City} - {schedule.StateDesc}</h4>
                      <footer className="blockquote-footer"><b>Job Description:</b> {schedule.JobDescription}</footer>
                    </blockquote>
                  );
                })
              }
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Schedule;
