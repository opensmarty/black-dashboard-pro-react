import React, { Component } from 'react';
import moment from "moment";
import Moment from "react-moment";

import { Formik, Field } from "formik";
import ReactDatetime from "react-datetime";
import axios from "axios";
import ReactTable from "react-table";

//import { useAlert } from "react-alert";

//import { withSwalInstance } from 'sweetalert2-react';
//import swal from 'sweetalert2';


import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Form,
  Table,
  Label,
  Input,
  Modal, ModalHeader, ModalBody, ModalFooter,
  CardFooter,
  FormGroup,
  Button
} from "reactstrap";
import { format } from 'util';

//const SweetAlert = withSwalInstance(swal);

class RegisterSchedule extends React.Component {





  constructor(props, context) {
    super(props, context);
    this.state = {
      //lista todos os schedules
      lista: [],

      //lista todos do team
      team: [],

      //lista todos do team que foram selecionados
      teamSelected: [],

      //variaveis do form
      DateStart: moment(),
      DateEnd: moment(),
      JobDescription: '',
      Address: '',
      City: '',
      StateDesc: '',
      ZipCode: '',
      ContactName: '',
      PhoneNumber: '',
      Information: '',
      Status: '',
      Workflow: '',

      //armazena id do schedule selecionado na table
      ScheduleId: '',

      //controle modal
      modal: false,


      // showAlert: false

    };

    this.toggle = this.toggle.bind(this);
    this.enviaForm = this.enviaForm.bind(this);
    this.setDateStart = this.setDateStart.bind(this);
    this.setDateEnd = this.setDateEnd.bind(this);
    this.setJobDescription = this.setJobDescription.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.setCity = this.setCity.bind(this);
    this.setStateDesc = this.setStateDesc.bind(this);
    this.setZipCode = this.setZipCode.bind(this);
    this.setContactName = this.setContactName.bind(this);
    this.setInformation = this.setInformation.bind(this);
    this.setPhoneNumber = this.setPhoneNumber.bind(this);
    this.selectTeam = this.selectTeam.bind(this);
    this.removeTeam = this.removeTeam.bind(this);

  }

  setDateStart(evento) {
    this.setState({ DateStart: moment(evento) });
  }

  setDateEnd(evento) {
    this.setState({ DateEnd: moment(evento) });
  }

  setJobDescription(evento) {
    this.setState({ JobDescription: evento.target.value });
  }

  setAddress(evento) {
    this.setState({ Address: evento.target.value });
  }

  setCity(evento) {
    this.setState({ City: evento.target.value });
  }

  setZipCode(evento) {
    this.setState({ ZipCode: evento.target.value });
  }

  setContactName(evento) {
    this.setState({ ContactName: evento.target.value });
  }

  setInformation(evento) {
    this.setState({ Information: evento.target.value });
  }

  setPhoneNumber(evento) {
    this.setState({ PhoneNumber: evento.target.value });
  }

  setStateDesc(evento) {
    this.setState({ StateDesc: evento.target.value });
  }

  //Retorna schedule cadastrado
  listaSchedule() {
    axios.get('http://localhost:8080/api/schedule')
      .then(response => {
        this.setState({ lista: response.data })
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Retorna team cadastrado
  listaTeam() {
    axios.get('http://localhost:8080/api/schedule/team')
      .then(response => {
        this.setState({ team: response.data })
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Registra dados do schedule
  enviaForm(evento) {
    var data = {
      DateStart: this.state.DateStart,
      DateEnd: this.state.DateEnd,
      Address: this.state.Address,
      City: this.state.Address,
      StateDesc: this.state.StateDesc,
      ZipCode: this.state.ZipCode,
      ContactName: this.state.ContactName,
      PhoneNumber: this.state.PhoneNumber,
      Information: this.state.Information,
      JobDescription: this.state.JobDescription
    };
    evento.preventDefault();
    axios.post('http://localhost:8080/api/schedule/create', data)
      .then(res => {

        this.listaSchedule();

        alert("Good Job!");
      })
      .catch(error => {
        console.log(error);
      });
  }

  //Registra team que vai executar o schedule
  registerTeam(team) {
    var data = {
      ScheduleId: this.state.ScheduleId,
      team: team.values
    };
    axios.post('http://localhost:8080/api/schedule/registerteam/', data)
      .then(res => {
        this.listaSchedule();
        this.verificaAllSelect();
        this.setState({ modal: false });
        alert("Good Job!");
      })
      .catch(error => {
        console.log(error);
      });
  };

  //****/Verifica se existe alguem no schedule por id do schedule
  verificaSelectedById(id) {
    axios.get('http://localhost:8080/api/schedule/getbyid/' + id)
      .then(res => {
        console.log(res.data)
        this.setState({ teamSelected: res.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Verifica se existe todos no schedule
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

  //Abre o modal informando o id do schedule selecionado.
  selectTeam(id) {
    this.toggle();
    this.setState({ ScheduleId: id.original.ScheduleId });
    //this.verificaSelectedById(id.original.ScheduleId);
  }

  //Deletar schedule selecionado.
  removeSchedule(id) {
    var data = {
      ScheduleId: id.original.ScheduleId,
    };
    axios.post('http://localhost:8080/api/schedule/delete/', data)
      .then(res => {
        this.listaSchedule();
        this.verificaAllSelect();
        this.listaTeam();
      })
      .catch(error => {
        console.log(error);
      });
  }

  //Deletar team selecionado.
  removeTeam(id) {
    var data = {
      ScheduleId: id.original.ScheduleId,
    };
    axios.post('http://localhost:8080/api/schedule/team/delete/', data)
      .then(res => {
        this.listaSchedule();
        this.verificaAllSelect();
        this.listaTeam();
      })
      .catch(error => {
        console.log(error);
      });
  }

  //Ao abrir a página executará funções
  componentDidMount() {
    this.listaSchedule();
    this.listaTeam();
    this.verificaAllSelect();



  }

  //Abre o modal.
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render(props) {

    let lgClose = () => this.setState({ lgShow: false });
    function Checkbox(props) {
      return (
        //Identifica as pessoas selecionadas no modal para formar o team.
        <Field name={props.name}>
          {({ field, form }) => (
            <label>
              <input
                type="checkbox"
                {...props}
                checked={field.value.includes(props.value)}
                onChange={() => {
                  if (field.value.includes(props.value)) {
                    const nextValue = field.value.filter(
                      value => value !== props.value
                    );
                    form.setFieldValue(props.name, nextValue);
                  } else {
                    const nextValue = field.value.concat(props.value);
                    form.setFieldValue(props.name, nextValue);
                  }
                }}
              />
              {props.value}
            </label>
          )}
        </Field>
      );
    }
    const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;

    return (
      <div className="content">
        <Formik initialValues={{ roles: [] }} onSubmit={values => this.registerTeam({ values })} >
          {formik => (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle} close={closeBtn}>Select Team - {this.state.ScheduleId}</ModalHeader>
              <ModalBody>
                <div className="content">
                  <Table responsive dark>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.team.map(function (timeSelecionado) {
                          return (
                            <tr key={timeSelecionado.Id}>
                              <td>
                                <div>
                                  <Checkbox name="roles" value={timeSelecionado.Id} />
                                </div>
                              </td>
                              <td>
                                {timeSelecionado.Name}
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="btn-fill" color="info" type="submit" onClick={formik.submitForm}>
                  Submit
                    </Button>{' '}
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          )}
        </Formik>
        <Row className="mt-12">
          <Col md="5">
            <Card >
              <CardHeader>
                <CardTitle tag="h4">Register Schedule</CardTitle>
              </CardHeader>
              <CardBody>
                <Form action="#" onSubmit={this.enviaForm}>
                  <label>Date Start</label>
                  <FormGroup>
                    <ReactDatetime
                      inputProps={{
                        className: "form-control",
                        placeholder: "Date scheduling",
                      }}
                      id="DateStart"
                      name="DateStart"
                      value={this.state.DateStart}
                      onChange={this.setDateStart}
                    />
                  </FormGroup>

                  <label>Prediction Finish</label>
                  <FormGroup>
                    <ReactDatetime
                      inputProps={{
                        className: "form-control",
                        placeholder: "Date scheduling",
                      }}
                      id="DateEnd"
                      name="DateEnd"
                      value={this.state.DateEnd}
                      onChange={this.setDateEnd}
                    />
                  </FormGroup>


                  <label>Address</label>
                  <FormGroup>
                    <Input type="text" id="Address" name="Address" value={this.state.Address} onChange={this.setAddress} />
                  </FormGroup>
                  <label>City</label>
                  <FormGroup>
                    <Input type="text" id="City" name="City" value={this.state.City} onChange={this.setCity} />
                  </FormGroup>
                  <label>State</label>
                  <FormGroup>
                    <Input type="text" id="StateDesc" name="StateDesc" value={this.state.StateDesc} onChange={this.setStateDesc} />
                  </FormGroup>
                  <label>ZipCode</label>
                  <FormGroup>
                    <Input type="text" value={this.state.ZipCode} onChange={this.setZipCode} />
                  </FormGroup>
                  <label>JobDescription</label>
                  <FormGroup>
                    <textarea className="form-control" type="text" value={this.state.JobDescription} onChange={this.setJobDescription} />
                  </FormGroup>
                  <label>Contact Name</label>
                  <FormGroup>
                    <Input type="text" value={this.state.ContactName} onChange={this.setContactName} />
                  </FormGroup>
                  <label>Phone Number</label>
                  <FormGroup>
                    <Input type="text" value={this.state.PhoneNumber} onChange={this.setPhoneNumber} />
                  </FormGroup>
                  <label>Information</label>
                  <FormGroup>
                    <textarea className="form-control" type="text" value={this.state.Information} onChange={this.setInformation} />
                  </FormGroup>
                  <Button className="btn-fill" color="info" type="submit">
                    Submit
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} md={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Schedule List</CardTitle>
              </CardHeader>
              <CardBody>
                <ReactTable keyField="id"
                  data={
                    this.state.lista}
                  onRowClick={data => {
                    console.log(data);
                  }}
                  columns={[
                    {
                      Header: "#",
                      Cell: props => {
                        return (
                          <div>

                            {
                              this.state.teamSelected.find(o => o.Schedule_ScheduleId === props.original.ScheduleId) ?
                                <Button className="btn-icon btn-simple" color="warning" size="sm" onClick={() => { this.removeTeam(props) }}>
                                  <i className="fa fa-user-times"></i>
                                </Button>
                                :
                                <Button className="btn-icon btn-simple" color="success" size="sm" onClick={() => { this.selectTeam(props) }}>
                                  <i className="fa fa-user"></i>
                                </Button>
                            }

                            <Button className="btn-icon btn-simple" color="danger" size="sm" onClick={() => { this.removeSchedule(props) }}>
                              <i className="fa fa-times" />
                            </Button>{` `}







                          </div>
                        )
                      }
                    },
                    {
                      Header: "Status",
                      Cell: props => {
                        return (
                          <span>
                            <span style={{
                              color: this.state.teamSelected.find(o => o.Schedule_ScheduleId === props.original.ScheduleId) ? '#FF0000'
                                // : schedule.Status === 2 ? '#ffbf00'
                                : '#57d500',
                              transition: 'all .3s ease'
                            }}>
                              &#x25cf;
                    </span> {
                              this.state.teamSelected.find(o => o.Schedule_ScheduleId === props.original.ScheduleId) ? 'Pending'
                              // : schedule.Status === 2 ? `Pending Approval`
                              : 'All set'
                          }
                          </span>
                        )
                      }
                    },
                    {
                      Header: "Date Start",
                      accessor: "DateStart",
                      id: "DateStart",
                      accessor: "DateStart"
                      
                    },
                    {
                      Header: "Prediction Finish",
                      accessor: "DateEnd",
                    },
                    {
                      Header: "Last Name",
                      accessor: "JobDescription",
                    },
                    {
                      Header: "Address",
                      accessor: "Address",
                    },
                    {
                      Header: "City",
                      accessor: "City",
                    },
                    {
                      Header: "Contact Name",
                      accessor: "ContactName",
                    },
                    {
                      Header: "Phone Number",
                      accessor: "PhoneNumber",
                    },
                  ]}
                  defaultPageSize={10}
                  className="-striped -highlight"
                  getTdProps={(state, rowInfo, column, instance) => {
                    if (rowInfo === undefined) {
                      return {}; // for blank rows...
                    }
                    rowInfo.field = column.id;
                    return {};
                  }}
                >
                </ReactTable>
                <br></br>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div >
    );
  }
}
export default RegisterSchedule;