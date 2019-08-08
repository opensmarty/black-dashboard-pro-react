import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import ReactDatetime from "react-datetime";
import SweetAlert from 'react-bootstrap-sweetalert';

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Input,
    Row
} from "reactstrap";



class Customer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

            //********************STEP 1 SOLD*******************//
            DateSold: moment(),

            Address: '',
            City: '',
            StateDesc: '',
            ZipCode: '',
            GMaps: '',
            ContactName: '',
            PhoneNumber: '',
            Information: '',
            //********************ARRAYS SUPPORT*******************//
            //list todos os schedules
            list: [],
            ScheduleId: '',
            alert: null

        };

        this.setDateSold = this.setDateSold.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.setCity = this.setCity.bind(this);
        this.setStateDesc = this.setStateDesc.bind(this);
        this.setZipCode = this.setZipCode.bind(this);
        this.setGMaps = this.setGMaps.bind(this);
        this.setContactName = this.setContactName.bind(this);
        this.setPhoneNumber = this.setPhoneNumber.bind(this);
        this.setInformation = this.setInformation.bind(this);

        this.postCustomer = this.postCustomer.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.removeCustomer = this.removeCustomer.bind(this);

        this.successCreatedAlert = this.successCreatedAlert.bind(this)
        this.successUpdatedAlert = this.successUpdatedAlert.bind(this)
        this.successDeleteAlert = this.successDeleteAlert.bind(this)
    }

    setDateSold(evento) {
        this.setState({ DateSold: moment(evento) });
    }

    setAddress(evento) {
        this.setState({ Address: evento.target.value });
    }

    setCity(evento) {
        this.setState({ City: evento.target.value });
    }

    setStateDesc(evento) {
        this.setState({ StateDesc: evento.target.value });
    }

    setZipCode(evento) {
        this.setState({ ZipCode: evento.target.value });
    }

    setGMaps(evento) {
        this.setState({ GMaps: evento.target.value });
    }

    setContactName(evento) {
        this.setState({ ContactName: evento.target.value });
    }

    setPhoneNumber(evento) {
        this.setState({ PhoneNumber: evento.target.value });
    }

    setInformation(evento) {
        this.setState({ Information: evento.target.value });
    }

    //Retorna schedule cadastrado
    ListCustomer() {
        //axios.get('https://app-back-obie.herokuapp.com/api/schedule')
        axios.get('http://localhost:5000/api/schedule')
            .then(response => {
                this.setState({ list: response.data })
            })
            .catch(error => {
                console.log(error);
            });
    };

    componentDidMount() {
        this.ListCustomer();
    }

    clearImputs() {
        this.setState({
            DateSold: moment(),
            Address: '',
            City: '',
            StateDesc: '',
            ZipCode: '',
            GMaps: '',
            ContactName: '',
            PhoneNumber: '',
            Information: '',
            ScheduleId: '',
        });
    }

    //Post object for creacte schedule
    postCustomer() {
        var data = {
            DateSold: this.state.DateSold,
            Address: this.state.Address,
            City: this.state.City,
            StateDesc: this.state.StateDesc,
            ZipCode: this.state.ZipCode,
            GMaps: this.state.GMaps,
            ContactName: this.state.ContactName,
            PhoneNumber: this.state.PhoneNumber,
            Information: this.state.Information
        };

        //axios.post('https://app-back-obie.herokuapp.com/api/schedule/customer/create', data)
        axios.post('http://localhost:5000/api/schedule/customer/create', data)
            .then(res => {
                this.ListCustomer();
                this.clearImputs(); //limpa campos//
                this.successCreatedAlert();
            })
            .catch(error => {
                console.log(error);
            });
    }

    //Select the schedule for update
    selectEdit(props) {
        this.setState({
            DateSold: moment(props.original.DateSold),
            Address: props.original.Address,
            City: props.original.City,
            StateDesc: props.original.StateDesc,
            ZipCode: props.original.ZipCode,
            GMaps: props.original.GMaps,
            ContactName: props.original.ContactName,
            PhoneNumber: props.original.PhoneNumber,
            Information: props.original.Information,
            ScheduleId: props.original.ScheduleId
        });
    }

    //Post object for update schedule
    updateCustomer(evento) {

        let data = {
            DateSold: this.state.DateSold,
            Address: this.state.Address,
            City: this.state.City,
            StateDesc: this.state.StateDesc,
            ZipCode: this.state.ZipCode,
            GMaps: this.state.GMaps,
            ContactName: this.state.ContactName,
            PhoneNumber: this.state.PhoneNumber,
            Information: this.state.Information,
            ScheduleId: this.state.ScheduleId 
        };

        evento.preventDefault();
        //axios.post('https://app-back-obie.herokuapp.com/api/schedule/update', data)
        axios.post('http://localhost:5000/api/schedule/customer/update', data)
            .then(res => {
                this.ListCustomer();
                this.clearImputs(); //limpa campos//
                this.successUpdatedAlert();
            })
            .catch(error => {
                console.log(error);
            });
    }

    //Deletar schedule selecionado.
    removeCustomer(id) {
        var data = {
            ScheduleId: id.original.ScheduleId,
        };
        //axios.post('https://app-back-obie.herokuapp.com/api/schedule/delete/', data)
        axios.post('http://localhost:5000/api/schedule/delete/', data)
            .then(res => {
                this.ListCustomer();
                this.clearImputs();
                this.hideAlert();
            })
            .catch(error => {
                console.log(error);
            });
    }

    successCreatedAlert() {
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{ display: "block", marginTop: "-100px" }}
                    title="Good job!"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Job created successfully!
                </SweetAlert>
            )
        });
    }

    successUpdatedAlert() {
        this.setState({
            alert: (
                <SweetAlert
                    success
                    style={{ display: "block", marginTop: "-100px" }}
                    title="Good job!"
                    onConfirm={() => this.hideAlert()}
                    onCancel={() => this.hideAlert()}
                    confirmBtnBsStyle="info"
                >
                    Job updated successfully!
                </SweetAlert>
            )
        });
    }

    successDeleteAlert(id) {
        this.setState({
            alert: (
                <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="default"
                title="Are you sure?"
                onConfirm={() => this.removeCustomer(id)}
                onCancel={() => this.hideAlert()}
                >
                You will not be able to recover this file!
                </SweetAlert>
            )
        });
    }

    hideAlert() {
        this.setState({
            alert: null
        });
    }

    render(props) {
        return (
            <div className="content">
                <Row className="mt-12">
                    <Col md="5">
                        <Card >
                            {this.state.alert}
                            <CardHeader>
                                <CardTitle tag="h4">Register Customer Job</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form action="#" onSubmit={this.postCustomer}>

                                    <blockquote className="blockquote">
                                        <label>Date Sold</label>
                                        <FormGroup>
                                            <ReactDatetime
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "Date sold",
                                                }}
                                                id="DateSold"
                                                name="DateSold"
                                                value={this.state.DateSold}
                                                onChange={this.setDateSold}
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
                                        <label>Link Google Maps</label>
                                        <FormGroup>
                                            <Input type="text" value={this.state.GMaps} onChange={this.setGMaps} />
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
                                    </blockquote>

                                </Form>
                                <Button className="btn-fill" color="info" type="submit" onClick={this.postCustomer}>
                                    Create New
                  </Button>
                                <Button className="btn-fill" color="success" onClick={this.updateCustomer} disabled={!this.state.ScheduleId}>
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
                                <CardTitle tag="h4">Customer Job List</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ReactTable keyField="id"
                                    data={
                                        this.state.list}
                                    onRowClick={data => {
                                    }}
                                    filterable
                                    columns={[
                                        {
                                            Header: "#",
                                            Cell: props => {
                                                return (
                                                    <div>
                                                        <Button className="btn-icon btn-simple" color="success" size="sm" onClick={() => { this.selectEdit(props) }}>
                                                            <i className="fa fa-edit" />
                                                        </Button>{` `}
                                                        <Button className="btn-icon btn-simple" color="danger" size="sm" onClick={() => { this.successDeleteAlert(props) }}>
                                                            <i className="fa fa-times" />
                                                        </Button>

                                                    </div>
                                                )
                                            }
                                        },
                                        {
                                            Header: "Date Sold",
                                            accessor: "DateSold",
                                            id: "DateSold",
                                            accessor: "DateSold"
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
}
export default Customer;