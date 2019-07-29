import React, { Component } from 'react';
import moment from "moment";
import { Formik, Field } from "formik";
import ReactDatetime from "react-datetime";
import axios from "axios";
import ReactTable from "react-table";
import MultiSelect from "@khanacademy/react-multi-select";
import Switch from 'react-bootstrap-switch';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Collapse,
  Form,
  FormGroup,
  Input,
  Label,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Row,
  Table
} from "reactstrap";

class RegisterSchedule extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

      //********************ARRAYS*******************//
      //lista todos os schedules
      lista: [],

      //lista todos do team
      team: [],

      //lista todos do team que foram selecionados
      teamSelected: [],

      //locations
      locations: [],
      locationsSelected: [],

      //followUp
      followUp: [],
      followUpSelected: [],

      //********************DATES*******************//
      //variaveis do form
      DateSold: moment(),
      DateWalk: moment(),
      DateStart: moment(),
      DateEnd: moment(),
      DateConcreteStart: moment(),
      DateConcreteEnd: moment(),
      DateShopEnd: moment(),
      DateRepairStart: moment(),
      DateRepairEnd: moment(),
      DateAllSet: moment(),

      //********************SINGLE*******************//
      JobDescription: '',
      Address: '',
      City: '',
      StateDesc: '',
      ZipCode: '',
      ContactName: '',
      PhoneNumber: '',
      Information: '',
      Status: '',
      ScheduleId: '',
      modal: false,
      ConcretePad: 1,
      Repair: 1,
      WalkThru: false,
      Equipment: false,
      Parts: false,
      collapseRepair: false,
    };

    this.setDateAllSet = this.setDateAllSet.bind(this);
    this.setDateShopEnd = this.setDateShopEnd.bind(this);
    this.setDateConcreteStart = this.setDateConcreteStart.bind(this);
    this.setDateConcreteEnd= this.setDateConcreteEnd.bind(this);
    this.setDateRepairStart = this.setDateRepairStart.bind(this);
    this.setDateRepairEnd= this.setDateRepairEnd.bind(this);
    this.setDateWalk = this.setDateWalk.bind(this);
    this.setRepair = this.setRepair.bind(this);
    this.setParts = this.setParts.bind(this);
    this.setEquipment = this.setEquipment.bind(this);
    this.setWalkThru = this.setWalkThru.bind(this);
    this.setConcretePad = this.setConcretePad.bind(this);
    this.atualizaForm = this.atualizaForm.bind(this);
    this.toggle = this.toggle.bind(this);
    this.enviaForm = this.enviaForm.bind(this);
    this.setDateSold = this.setDateSold.bind(this);
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
    this.cancelForm = this.cancelForm.bind(this);
  }

  toggleRepair() {
    this.setState({
      collapseRepair: !this.state.collapseRepair
    });
  }

  cancelForm() {
    this.setState({ ScheduleId: '' });
  }

  //Seleciona o schedule para alteracao
  toggleModalLarge(props) {
    this.setState({
      DateSold: moment(props.original.DateSold),
      DateStart: moment(props.original.DateStart),
      DateEnd: moment(props.original.DateEnd),
      Address: props.original.Address,
      City: props.original.City,
      StateDesc: props.original.StateDesc,
      ZipCode: props.original.ZipCode,
      ContactName: props.original.ContactName,
      PhoneNumber: props.original.PhoneNumber,
      Information: props.original.Information,
      JobDescription: props.original.JobDescription,
      ScheduleId: props.original.ScheduleId,
      ConcretePad: props.original.ConcretePad,
      WalkThru: Boolean(props.original.WalkThru),
      Equipment: props.original.Equipment,
      Parts: props.original.Parts,
      Repair: props.original.Repair,
      DateAllSet: moment(props.original.DateAllSet),
      DateConcreteStart: moment(props.original.DateConcreteStart),
      DateConcreteEnd: moment(props.original.DateConcreteEnd),
      DateRepairStart: moment(props.original.DateRepairStart),
      DateRepairEnd: moment(props.original.DateRepairEnd),
      DateShopEnd: moment(props.original.DateShopEnd),
    });
  }

  //Registra dados do schedule
  enviaForm(evento) {
    var data = {
      DateSold: this.state.DateSold,
      DateStart: this.state.DateStart,
      DateEnd: this.state.DateEnd,
      Address: this.state.Address,
      City: this.state.City,
      StateDesc: this.state.StateDesc,
      ZipCode: this.state.ZipCode,
      ContactName: this.state.ContactName,
      PhoneNumber: this.state.PhoneNumber,
      Information: this.state.Information,
      JobDescription: this.state.JobDescription,
      ConcretePad: this.state.ConcretePad,
      WalkThru: this.state.WalkThru,
      Equipment: this.state.Equipment,
      Parts: this.state.Parts,
    };

    evento.preventDefault();

    //axios.post('https://app-back-obie.herokuapp.com/api/schedule/create', data)
    axios.post('http://localhost:5000/api/schedule/create', data)
      .then(res => {
        this.listaSchedule();
        console.log(res);
        alert("Good Job!");

      })
      .catch(error => {
        console.log(error);
      });
  }

  //Registra dados do schedule
  atualizaForm(evento) {
    var data = {

      //********************DATES*******************//
      DateSold: moment(this.state.DateSold),
      DateStart: moment(this.state.DateStart),
      DateEnd: moment(this.state.DateEnd),
      DateConcreteStart: moment(this.state.DateConcreteStart),
      DateConcreteEnd: moment(this.state.DateConcreteEnd),
      DateRepairStart: moment(this.state.DateRepairStart),
      DateRepairEnd: moment(this.state.DateRepairEnd),
      DateWalk: moment(this.state.DateWalk),
      DateShopEnd: moment(this.state.DateShopEnd),
      DateAllSet: moment(this.state.DateAllSet),  

      //********************SINGLE*******************//
      Address: this.state.Address,
      City: this.state.City,
      StateDesc: this.state.StateDesc,
      ZipCode: this.state.ZipCode,
      ContactName: this.state.ContactName,
      PhoneNumber: this.state.PhoneNumber,
      Information: this.state.Information,
      JobDescription: this.state.JobDescription,
      ScheduleId: this.state.ScheduleId,
      ConcretePad: this.state.ConcretePad,
      Repair: this.state.Repair,
      WalkThru: this.state.WalkThru, 
      Equipment: this.state.Equipament,
      Parts: this.state.Parts
    };

    evento.preventDefault();
    //axios.post('https://app-back-obie.herokuapp.com/api/schedule/update', data)
    axios.post('http://localhost:5000/api/schedule/update', data)
      .then(res => {
        this.listaSchedule();

        this.enviaLocation(this.state.ScheduleId);


        alert("Good Job!");
      })
      .catch(error => {
        console.log(error);
      });
  }

  enviaLocation(scheduleId){
    console.log("Doido", scheduleId);
  }

  setDateAllSet(evento) {
    this.setState({ DateAllSet: moment(evento) });
  }

  setDateShopEnd(evento) {
    this.setState({ DateShopEnd: moment(evento) });
  }

  setDateRepairStart(evento) {
    this.setState({ DateRepairStart: moment(evento) });
  }

  setDateRepairEnd(evento) {
    this.setState({ DateRepairEnd: moment(evento) });
  }

  setDateConcreteStart(evento) {
    this.setState({ DateConcreteStart: moment(evento) });
  }

  setDateConcreteEnd(evento) {
    this.setState({ DateConcreteEnd: moment(evento) });
  }

  setDateWalk(evento) {
    this.setState({ DateWalk: moment(evento) });
  }


  setDateSold(evento) {
    this.setState({ DateSold: moment(evento) });
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

  setConcretePad(evento) {
    this.setState({ ConcretePad: evento.target.value });
  }

  setWalkThru() {
    this.setState({ WalkThru: !this.state.WalkThru });
    //  this.setState({ WalkThru: evento.target.value });
  }

  setEquipment() {
    this.setState({ Equipment: !this.state.Equipment });
    //  this.setState({ WalkThru: evento.target.value });
  }

  setParts() {
    this.setState({ Parts: !this.state.Parts });
    //  this.setState({ WalkThru: evento.target.value });
  }


  //Retorna schedule cadastrado
  listaSchedule() {

    //axios.get('https://app-back-obie.herokuapp.com/api/schedule')
    axios.get('http://localhost:5000/api/schedule')
      .then(response => {
        this.setState({ lista: response.data })
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Retorna team cadastrado
  listaTeam() {
    //axios.get('https://app-back-obie.herokuapp.com/api/schedule/team')
    axios.get('http://localhost:5000/api/schedule/team')
      .then(response => {
        this.setState({ team: response.data })
      })
      .catch(error => {
        console.log(error);
      });
  };

  //Registra team que vai executar o schedule
  registerTeam(team) {
    var data = {
      ScheduleId: this.state.ScheduleId,
      team: team.values
    };
    //axios.post('https://app-back-obie.herokuapp.com/api/schedule/registerteam/', data)
    axios.post('http://localhost:5000/api/schedule/registerteam/', data)
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
    // axios.get('https://app-back-obie.herokuapp.com/api/schedule/getbyid/' + id)
    axios.get('http://localhost:5000/api/schedule/getbyid/' + id)
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
    // axios.get('https://app-back-obie.herokuapp.com/api/schedule/getAllSelected/')
    axios.get('http://localhost:5000/api/schedule/getAllSelected/')
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
    //axios.post('https://app-back-obie.herokuapp.com/api/schedule/delete/', data)
    axios.post('http://localhost:5000/api/schedule/delete/', data)
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
    axios.post('http://localhost:5000/api/schedule/team/delete/', data)
      .then(res => {
        this.listaSchedule();
        this.verificaAllSelect();
        this.listaTeam();
      })
      .catch(error => {
        console.log(error);
      });
  }





  //Retorna os locais que podem ser instalados os sistemas
  getAllLocations() {
    // axios.get('https://app-back-obie.herokuapp.com/api/schedule/getAllSelected/')
    axios.get('http://localhost:5000/api/schedule/location/')
      .then(res => {
        console.log(res.data)
        this.setState({ locations: res.data });

      })
      .catch(error => {
        console.log(error);
      });
  };



  //Retorna os status possiveis para o followup
  getAllFollowUp() {
    // axios.get('https://app-back-obie.herokuapp.com/api/schedule/getAllSelected/')
    axios.get('http://localhost:5000/api/schedule/followup/')
      .then(res => {
        console.log(res.data)
        this.setState({ followUp: res.data });

      })
      .catch(error => {
        console.log(error);
      });
  };


  setRepair(evento) {
    this.setState({ Repair: evento.target.value });
  }

  //Ao abrir a página executará funções
  componentDidMount() {
    this.getAllLocations();
    this.getAllFollowUp();
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

  handleSwitchEquip(elem, state) {
    // console.log('handleSwitch. elem:', elem);
    //console.log('name:', elem.props.name);
    //console.log('new state:', state);
    this.setState({ Equip: state });
  }

  handleSwitchParts(elem, state) {
    //console.log('handleSwitch. elem:', elem);
    //console.log('name:', elem.props.name);
    //console.log('new state:', state);
    this.setState({ Parts: state });
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

    //remodela o array de locais
    let optionsLocations = this.state.locations.map(function (location) {
      return { value: location.LocationId, label: location.Desc };
    })

    //remodela o array de followup
    let optionsFollow = this.state.followUp.map(function (follow) {
      return { value: follow.FollowUpId, label: follow.Desc };
    })






    return (
      <div className="content">
        <Formik initialValues={{ roles: [] }} onSubmit={values => this.registerTeam({ values })} >
          {formik => (
            <Modal isOpen={this.state.modal} toggle={this.toggle} modalClassName="modal-black">
              <ModalHeader toggle={this.toggle} close={closeBtn}>Select Team - {this.state.ScheduleId}</ModalHeader>
              <ModalBody>
                <div className="content">
                  <Table responsive>
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

                  <label>Date Sold</label>
                  <FormGroup>
                    <ReactDatetime
                      inputProps={{
                        className: "form-control",
                        placeholder: "Date scheduling",
                      }}
                      id="DateSold"
                      name="DateSold"
                      value={this.state.DateSold}
                      onChange={this.DateSold}
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

















                  <blockquote className="blockquote">
                    <label>Walk Thru Scheduled?</label>
                    <FormGroup>
                      <Switch
                        defaultValue={false}
                        value={this.state.WalkThru}
                        onChange={this.setWalkThru}
                        offColor="primary"
                        offText="No"
                        onColor="primary"
                        onText="Yes"
                      />{" "}
                    </FormGroup>

                    <Collapse isOpen={this.state.WalkThru === true}>



                    <label>Date Schedule Walk Thru
                    </label>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          className: "form-control",
                          placeholder: "Date scheduling",
                        }}
                        id="DateWalk"
                        name="DateWalk"
                        value={this.state.DateWalk}
                        onChange={this.setDateWalk}
                      />
                    </FormGroup>




                    <label>Place</label>
                    <FormGroup>
                      <MultiSelect
                        options={optionsLocations}
                        selected={this.state.locationsSelected}
                        onSelectedChanged={locationsSelected => this.setState({ locationsSelected })}
                      />
                    </FormGroup>


                    <label>JobDescription</label>
                    <FormGroup>
                      <textarea className="form-control" type="text" value={this.state.JobDescription} onChange={this.setJobDescription} />
                    </FormGroup>





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

                    </Collapse>
                  </blockquote>
                  <blockquote className="blockquote">


                    <label>Concret Pad</label>


                    <FormGroup>
                      <FormGroup check className="form-check-radio" inline>
                        <Label className="form-check-label">
                          <Input type="radio" name="concretPad" id="exampleRadios1" value="1" checked={this.state.ConcretePad === 1} onChange={ConcretePad => this.setState({ ConcretePad: 1 })} />
                          N/A
            <span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                      <FormGroup check className="form-check-radio" inline>
                        <Label className="form-check-label">
                          <Input type="radio" name="concretPad" id="exampleRadios2" value="2" checked={this.state.ConcretePad === 2} onChange={ConcretePad => this.setState({ ConcretePad: 2 })} />
                          Yes
          <span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                      <FormGroup check className="form-check-radio" inline>
                        <Label className="form-check-label">
                          <Input type="radio" name="concretPad" id="exampleRadios3" value="3" checked={this.state.ConcretePad === 3} onChange={ConcretePad => this.setState({ ConcretePad: 3 })} />
                          No
          <span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                    </FormGroup>





                    <Collapse isOpen={this.state.ConcretePad === 2}>

                      <label>Schedule Date</label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "Date scheduling",
                          }}
                          id="setDateConcreteStart"
                          name="setDateConcreteStart"
                          value={this.state.DateConcreteStart}
                          onChange={this.setDateConcreteStart}
                        />
                      </FormGroup>
                      <label>Finish Step</label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "Date scheduling",
                          }}
                          id="setDateConcreteEnd"
                          name="setDateConcreteEnd"
                          value={this.state.DateConcreteEnd}
                          onChange={this.setDateConcreteEnd}
                        />
                      </FormGroup>
                    </Collapse>


                  </blockquote>




                  <blockquote className="blockquote">
                    <label>Equipment</label>
                    <FormGroup>
                      <Switch
                        defaultValue={false}
                        value={this.state.Equipment}
                        onChange={this.setEquipment}
                        offColor="primary"
                        offText="No"
                        onColor="primary"
                        onText="Yes"
                      />{" "}
                    </FormGroup>


                    <label>Parts</label>
                    <FormGroup>
                      <Switch
                        defaultValue={false}
                        value={this.state.Parts}
                        onChange={this.setParts}
                        offColor="primary"
                        offText="No"
                        onColor="primary"
                        onText="Yes"
                      />{" "}
                    </FormGroup>

                    <label>Finish Step</label>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          className: "form-control",
                          placeholder: "Date scheduling",
                        }}
                        id="setDateShopEnd"
                        name="setDateShopEnd"
                        value={this.state.DateShopEnd}
                        onChange={this.setDateShopEnd}
                      />
                    </FormGroup>

                  </blockquote>



                  <blockquote className="blockquote">
                    <label>Repair</label>


                    <FormGroup>
                      <FormGroup check className="form-check-radio" inline>
                        <Label className="form-check-label">
                          <Input type="radio" name="RepairRadios" value="1" checked={this.state.Repair === 1} onChange={Repair => this.setState({ Repair: 1 })} />
                          N/A
<span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                      <FormGroup check className="form-check-radio" inline>
                        <Label className="form-check-label">
                          <Input type="radio" name="RepairRadios" value="2" checked={this.state.Repair === 2} onChange={Repair => this.setState({ Repair: 2 })} />
                          Yes
<span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                      <FormGroup check className="form-check-radio" inline>
                        <Label className="form-check-label">
                          <Input type="radio" name="RepairRadios" value="3" checked={this.state.Repair === 3} onChange={Repair => this.setState({ Repair: 3 })} />
                          No
<span className="form-check-sign"></span>
                        </Label>
                      </FormGroup>
                    </FormGroup>



                    <Collapse isOpen={this.state.Repair === 2}>
                      <label>Repair Date</label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "Date scheduling",
                          }}
                          id="DateRepairStart"
                          name="DateRepairStart"
                          value={this.state.DateRepairStart}
                          onChange={this.setDateRepairStart}
                        />
                      </FormGroup>
                      <label>Finish Step</label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "Date scheduling",
                          }}
                          id="DateRepairEnd"
                          name="DateRepairEnd"
                          value={this.state.DateRepairEnd}
                          onChange={this.setDateRepairEnd}
                        />
                      </FormGroup>

                    </Collapse>







                  </blockquote>






                  <blockquote className="blockquote">
                    <label>Follow Up</label>
                    <FormGroup>
                      <MultiSelect
                        options={optionsFollow}
                        selected={this.state.followUpSelected}
                        onSelectedChanged={followUpSelected => this.setState({ followUpSelected })}
                      />
                    </FormGroup>


                    <label>All Set Date </label>
                    <FormGroup>
                      <ReactDatetime
                        inputProps={{
                          className: "form-control",
                          placeholder: "Date scheduling",
                        }}
                        id="DateEnd"
                        name="DateEnd"
                        value={this.state.DateAllSet}
                        onChange={this.setDateAllSet}
                      />
                    </FormGroup>

                  </blockquote>



                </Form>



                <Button className="btn-fill" color="info" type="submit" onClick={this.enviaForm}>
                  Create New
                  </Button>

                <Button className="btn-fill" color="success" onClick={this.atualizaForm} disabled={!this.state.ScheduleId}>
                  Save Editions
                  </Button>

                <Button className="btn-fill" color="warning" onClick={this.cancelForm} disabled={!this.state.ScheduleId}>
                  Cancel
                  </Button>

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
                  }}
                  filterable
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
                            <Button className="btn-icon btn-simple" color="default" size="sm" onClick={() => { this.toggleModalLarge(props) }}>
                              <i className="fa fa-edit" />
                            </Button>
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
                              color: this.state.teamSelected.find(o => o.Schedule_ScheduleId === props.original.ScheduleId) ? '#57d500'
                                // : schedule.Status === 2 ? '#ffbf00'
                                : '#FF0000',
                              transition: 'all .3s ease'
                            }}>
                              &#x25cf;
                          </span> {
                              this.state.teamSelected.find(o => o.Schedule_ScheduleId === props.original.ScheduleId) ? 'All set'
                                // : schedule.Status === 2 ? `Pending Approval`
                                : 'Pending'
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