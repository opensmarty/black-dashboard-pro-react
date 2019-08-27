import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import ReactDatetime from "react-datetime";
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from "react-select";
import MultiSelect from "@khanacademy/react-multi-select";
import Switch from 'react-bootstrap-switch';


import { graphql, ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Label,
    Form,
    FormGroup,
    Collapse,
    Input,
    Row
} from "reactstrap";
import { equal } from 'assert';

const token = localStorage.getItem('auth-token');

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:3000/graphql',
    headers: {
        authorization: token ? `Bearer ${token}` : "",
    }
});

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
	}
}
`

const getGroupsUsers = gql`
query getGroupList($first: Int, $offset: Int) {
	groups(first: $first, offset: $offset) {
		GroupId
		Role
		Desc
		users {
			id,
			name, 
			email
		}
	}
}
`

const getAllTypesPermits = gql`
query getAllTypesPermits($first: Int, $offset: Int) {
	permits(first: $first, offset: $offset) {
		PermitId
		Type
	}
}
`

const getSupplierMaterial = gql`
query suppliersMaterial($first: Int, $offset: Int) {
	suppliersMaterial(first: $first, offset: $offset) {
		SupplierId
        Name
        Type
	}
}
`

const getSupplierService = gql`
query suppliersService($first: Int, $offset: Int) {
	suppliersService(first: $first, offset: $offset) {
		SupplierId
        Name
        Type
	}
}
`

const createTeam = gql`
mutation createTeam($createTeamInput: CreateTeamInput!) {
	createTeam(input: $createTeamInput) {
		ExecutionId
        id
	}
}
`



class BackOffice extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

            ScheduleId: '',
            CustomerName: '',
            Address: '',
            City: '',

            DateWalkthruSchedule: '',
            ProjectManager: '',
            DateWalkthruExecution: '',
            WalkInformation: '',
            ConcretePad: 1,
            DateConcretePadScheduled: null,
            DateConcretePadScheduledFinish: null,
            DateConcreteStart: null,
            DateConcreteEnd: null,
            Permit: false,
            Supplier: false,
            Parts: false,
            Equipment: false,
            PathandPaint: 1,
            DatePathandPaintStart: null,
            DatePathandPaintEnd: null,
            DateFinalWalkthruScheduled: null,
            ProjectFinalManager: '',
            DateFinalWalkthruExecution: null,
            WalkFinalInformation: '',

            //LISTAS
            GroupsUserList: [],
            groupUserListSelected: [],

            PermitTypeList: [],
            permitTypeListSelected: [],

            SupplierServiceList: [],
            supplierServiceListSelected: [],

            SupplierProductList: [],
            supplierProductListSelected: [],

            supplierPartsListSelected: [],

            GroupsUserListInstaller: [],
            installersGroupsUserListInstaller: [],
        };

        this.selectEdit = this.selectEdit.bind(this);
        this.setWalkInformation = this.setWalkInformation.bind(this);
        this.setDateWalkthruSchedule = this.setDateWalkthruSchedule.bind(this);
        this.setProjectManager = this.setProjectManager.bind(this);
        this.setDateWalkthruExecution = this.setDateWalkthruExecution.bind(this);
        this.setDateConcretePadScheduled = this.setDateConcretePadScheduled.bind(this);
        this.setDateConcretePadScheduledFinish = this.setDateConcretePadScheduledFinish.bind(this);
        this.setDateConcreteStart = this.setDateConcreteStart.bind(this);
        this.setDateConcreteEnd = this.setDateConcreteEnd.bind(this);
        this.setPermit = this.setPermit.bind(this);
        this.setSupplier = this.setSupplier.bind(this);
        this.setParts = this.setParts.bind(this);
        this.setEquipment = this.setEquipment.bind(this);
        this.setPathandPaint = this.setPathandPaint.bind(this);
        this.setDatePathandPaintStart = this.setDatePathandPaintStart.bind(this);
        this.setDatePathandPaintEnd = this.setDatePathandPaintEnd.bind(this);
        this.setDateFinalWalkthruScheduled = this.setDateFinalWalkthruScheduled.bind(this);
        this.setProjectFinalManager = this.setProjectFinalManager.bind(this);
        this.setDateFinalWalkthruExecution = this.setDateFinalWalkthruExecution.bind(this);
        this.setWalkFinalInformation = this.setWalkFinalInformation.bind(this);
        this.getGroupsUserList = this.getGroupsUserList.bind(this);
        this.getAllTypesPermits = this.getAllTypesPermits.bind(this);
        this.getSupplierService = this.getSupplierService.bind(this);
        this.getSupplierMaterial = this.getSupplierMaterial.bind(this);
        this.createTeam = this.createTeam.bind(this);
    }

    setWalkInformation(evento) {
        this.setState({ WalkInformation: evento.target.value });
    }

    setDateWalkthruSchedule(evento) {
        this.setState({ DateWalkthruSchedule: moment(evento) });
    }

    setProjectManager(evento) {
        this.setState({ ProjectManager: this.state.ProjectManager });
    }

    setDateWalkthruExecution(evento) {
        this.setState({ DateWalkthruExecution: moment(evento) });
    }

    setConcretePad(evento) {
        this.setState({ ConcretePad: this.state.ConcretePad });
    }

    setDateConcretePadScheduled(evento) {
        this.setState({ DateConcretePadScheduled: moment(evento) });
    }

    setDateConcretePadScheduledFinish(evento) {
        this.setState({ DateConcretePadScheduledFinish: moment(evento) });
    }

    setDateConcreteStart(evento) {
        this.setState({ DateConcreteStart: moment(evento) });
    }

    setDateConcreteEnd(evento) {
        this.setState({ DateConcreteEnd: moment(evento) });
    }

    setPermit() {
        this.setState({ Permit: !this.state.Permit });
    }

    setSupplier(evento) {
        this.setState({ Supplier: !this.state.Supplier });
    }

    setEquipment(evento) {
        this.setState({ Equipment: !this.state.Equipment });
    }

    setParts(evento) {
        this.setState({ Parts: !this.state.Parts });
    }

    setPathandPaint(evento) {
        this.setState({ PathandPaint: this.state.PathandPaint });
    }

    setDatePathandPaintStart(evento) {
        this.setState({ DatePathandPaintStart: moment(evento) });
    }

    setDatePathandPaintEnd(evento) {
        this.setState({ DatePathandPaintEnd: moment(evento) });
    }

    setDateFinalWalkthruScheduled(evento) {
        this.setState({ DateFinalWalkthruScheduled: moment(evento) });
    }

    setProjectFinalManager(evento) {
        this.setState({ ProjectFinalManager: this.state.ProjectFinalManager });
    }

    setDateFinalWalkthruExecution(evento) {
        this.setState({ DateFinalWalkthruExecution: moment(evento) });
    }

    setWalkFinalInformation(evento) {
        this.setState({ WalkFinalInformation: moment(evento) });
    }


    getGroupsUserList() {
        client.query({
            query: getGroupsUsers,
            optimisticResponse: {},
        }).then(res => {
            var listaGrupo = [res.data];

            for (var i = 0; i < listaGrupo.length; i++) {

                for (var j = 0; j < listaGrupo[i].groups.length; j++) {

                    if (listaGrupo[i].groups[j].GroupId == 1) {

                        this.setState({ GroupsUserList: listaGrupo[i].groups[j].users })

                    };


                    console.log(listaGrupo[i].groups[j]);

                    if (listaGrupo[i].groups[j].GroupId == 2) {
                        this.setState({ GroupsUserListInstaller: listaGrupo[i].groups[j].users })

                    }



                    console.log(this.state.GroupsUserList);
                }
            }
        }).catch(error => {
            this.setState({ msg: error.message });
        });
    }

    getAllTypesPermits() {
        client.query({
            query: getAllTypesPermits,
            optimisticResponse: {},
        }).then(res => {
            var listaPermits = [res.data];

            for (var i = 0; i < listaPermits.length; i++) {
                this.setState({ PermitTypeList: listaPermits[i].permits });
            }

        }).catch(error => {
            this.setState({ msg: error.message });
        });
    }

    getSupplierService() {
        client.query({
            query: getSupplierService,
            optimisticResponse: {},
        }).then(res => {

            var supplierServiceList = [res.data];

            for (var i = 0; i < supplierServiceList.length; i++) {

                for (var j = 0; j < supplierServiceList[i].suppliersService.length; j++) {

                    this.setState({ SupplierServiceList: supplierServiceList[i].suppliersService });
                }

            }

        }).catch(error => {
            this.setState({ msg: error.message });
        });
    }

    getSupplierMaterial() {
        client.query({
            query: getSupplierMaterial,
            optimisticResponse: {},
        }).then(res => {
            var supplierMaterialList = [res.data];
            for (var i = 0; i < supplierMaterialList.length; i++) {

                for (var j = 0; j < supplierMaterialList[i].suppliersMaterial.length; j++) {
                    this.setState({ SupplierProductList: supplierMaterialList[i].suppliersMaterial });
                }

            }
        }).catch(error => {
            this.setState({ msg: error.message });
        });
    }

    createTeam(){

        var team = {
            id: this.state.installersGroupsUserListInstaller,
            ExecutionId: this.state.ExecutionId,
            
        }
        client.mutate({
            mutation: createTeam,
            variables: { team },
            optimisticResponse: {},
            refetchQueries: () => [{ query: getScheduleList }]

        }).then(res => {
            this.successCreatedAlert();
        }).catch(error => {
            this.setState({ msg: error.message });
        });


    }

    //Select the schedule for update
    selectEdit(props) {
        this.setState({
            ScheduleId: props.original.ScheduleId,
            City: props.original.City,

            CustomerName: props.original.CustomerName,
            Address: props.original.Address,
            DateWalkthruSchedule: props.original.DateWalkthruSchedule,
            ProjectManager: props.original.ProjectManager,
            DateWalkthruExecution: props.original.DateWalkthruExecution,
            WalkInformation: props.original.WalkInformation,
            ConcretePad: props.original.ConcretePad,
            DateConcretePadScheduled: props.original.DateConcretePadScheduled,
            DateConcretePadScheduledFinish: props.original.DateConcretePadScheduledFinish,
            DateConcreteStart: props.original.DateConcreteStart,
            DateConcreteEnd: props.original.DateConcreteEnd,
            Permit: props.original.Permit,
            Supplier: props.original.Supplier,
            Parts: props.original.Parts,
            Equipment: props.original.Equipment,
            PathandPaint: props.original.PathandPaint,
            DatePathandPaintStart: props.original.DatePathandPaintStart,
            DatePathandPaintEnd: props.original.DatePathandPaintEnd,
            DateFinalWalkthruScheduled: props.original.DateFinalWalkthruScheduled,
            ProjectFinalManager: props.original.ProjectFinalManager,
            DateFinalWalkthruExecution: props.original.DateFinalWalkthruExecution,
            WalkFinalInformation: props.original.WalkFinalInformation,


        });
    }


    componentDidMount() {
        this.getGroupsUserList();
        this.getAllTypesPermits();
        this.getSupplierService();
        this.getSupplierMaterial();
    }

    render(props) {

        var columns = [
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
                Header: "Customer Name",
                accessor: "CustomerName",
            },
            {
                Header: "Customer Phone",
                accessor: "CustomerPhone",
            },
        ];


        let optionsUserWalk = this.state.GroupsUserList.map(function (group) {
            return { value: group.id, label: group.name };
        })


        let optionsListPermits = this.state.PermitTypeList.map(function (permit) {
            return { value: permit.PermitId, label: permit.Type };
        })

        let optionsListServiceSuppliers = this.state.SupplierServiceList.map(function (supplierService) {
            return { value: supplierService.SupplierId, label: supplierService.Name };
        })

        let optionsListProductSuppliers = this.state.SupplierProductList.map(function (supplierMaterial) {
            return { value: supplierMaterial.SupplierId, label: supplierMaterial.Name };
        })


        let optionsGroupsUserListInstaller = this.state.GroupsUserListInstaller.map(function (installers) {
            return { value: installers.id, label: installers.name };
        })

        return (
            <div className="content">
                <Row className="mt-12">

                    <Col md="12">
                        <Card >
                            {this.state.alert}
                            <CardHeader>
                                <CardTitle tag="h4">Backoffice</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <h3><b>Customer Name:</b> {this.state.CustomerName} </h3>
                                <h3><b>Address</b> {this.state.Address} </h3>
                            </CardBody>
                        </Card >
                    </Col>

                </Row>

                <Row className="mt-12">

















                    <Col md="6">
                        <Card >
                            {this.state.alert}
                            <CardBody>
                                <Form action="#" onSubmit={this.updateScheduleExecution}>

                                    <blockquote className="blockquote">
                                        <h5>Walk Thru Scheduled</h5>
                                        <label>Date Scheduled</label>
                                        <FormGroup>
                                            <ReactDatetime
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "Date scheduling",
                                                }}
                                                id="DateWalkthruSchedule"
                                                name="DateWalkthruSchedule"
                                                value={this.state.DateWalkthruSchedule}
                                                onChange={this.setDateWalkthruSchedule}
                                            />
                                        </FormGroup>
                                        <Collapse isOpen={this.state.DateWalkthruSchedule !== null}>
                                            <label>Date Walk Thru Finish</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DateWalkthruExecution"
                                                    name="DateWalkthruExecution"
                                                    value={this.state.DateWalkthruExecution}
                                                    onChange={this.setDateWalkthruExecution}
                                                />
                                            </FormGroup>

                                            <label>Who</label>
                                            <FormGroup>
                                                <Select
                                                    options={optionsUserWalk}
                                                    selected={this.state.groupUserListSelected}
                                                    onSelectedChanged={groupUserListSelected => this.setState({ groupUserListSelected })}
                                                />
                                            </FormGroup>
                                            <label>Walk Thru Information</label>
                                            <FormGroup>
                                                <textarea className="form-control" type="text" value={this.state.WalkInformation || ''} onChange={this.setWalkInformation} />
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

                                            <label>Concredete Pad - Schedule Start</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date concrete pad scheduling",
                                                    }}
                                                    id="DateConcretePadScheduled"
                                                    name="DateConcretePadScheduled"
                                                    value={this.state.DateConcretePadScheduled}
                                                    onChange={this.setDateConcretePadScheduled}
                                                />
                                            </FormGroup>

                                            <label>Concredete Pad - Schedule Prediction Finish</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date concrete pad scheduling prediction finish",
                                                    }}
                                                    id="DateConcretePadScheduledFinish"
                                                    name="DateConcretePadScheduledFinish"
                                                    value={this.state.DateConcretePadScheduledFinish}
                                                    onChange={this.setDateConcretePadScheduledFinish}
                                                />
                                            </FormGroup>


                                            <label>Data Start</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date concrete start",
                                                    }}
                                                    id="DateConcreteStart"
                                                    name="DateConcreteStart"
                                                    value={this.state.DateConcreteStart}
                                                    onChange={this.setDateConcreteStart}
                                                />
                                            </FormGroup>

                                            <label>Data Walk Thru Scheduled</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date concrete end",
                                                    }}
                                                    id="DateConcreteEnd"
                                                    name="DateConcreteEnd"
                                                    value={this.state.DateConcreteEnd}
                                                    onChange={this.setDateConcreteEnd}
                                                />
                                            </FormGroup>

                                        </Collapse>

                                    </blockquote>





















                                    <blockquote className="blockquote">
                                        <label>Permit</label>
                                        <FormGroup>
                                            <Switch
                                                defaultValue={false}
                                                value={this.state.Permit}
                                                onChange={this.setPermit}
                                                offColor="primary"
                                                offText="No"
                                                onColor="primary"
                                                onText="Yes"
                                            />{" "}
                                        </FormGroup>

                                        <Collapse isOpen={this.state.Permit === true}>
                                            <label>Issue Date</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DateRepairEnd"
                                                    name="DateRepairEnd"
                                                    value={this.state.DatePermit}
                                                    onChange={this.setDatePermit}
                                                />
                                            </FormGroup>
                                            <label>Type</label>
                                            <FormGroup>


                                                <Select
                                                    options={optionsListPermits}
                                                    selected={this.state.permitTypeListSelected}
                                                    onSelectedChanged={permitTypeListSelected => this.setState({ permitTypeListSelected })}
                                                />

                                            </FormGroup>



                                        </Collapse>
                                    </blockquote>








                                    <blockquote className="blockquote">
                                        <label>Supplier</label>
                                        <FormGroup>
                                            <Switch
                                                defaultValue={false}
                                                value={this.state.Supplier}
                                                onChange={this.setSupplier}
                                                offColor="primary"
                                                offText="No"
                                                onColor="primary"
                                                onText="Yes"
                                            />{" "}
                                        </FormGroup>
                                        <Collapse isOpen={this.state.Supplier === true}>
                                            <label>Supplier Name</label>
                                            <FormGroup>
                                                <Select
                                                    options={optionsListServiceSuppliers}
                                                    selected={this.state.supplierServiceListSelected}
                                                    onSelectedChanged={supplierServiceListSelected => this.setState({ supplierServiceListSelected })}
                                                />
                                            </FormGroup>
                                            <label>Date Supplier Scheduled</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DateTradeScheduled"
                                                    name="DateTradeScheduled"
                                                    value={this.state.DateTradeScheduled}
                                                    onChange={this.setDateTradeScheduled}
                                                />
                                            </FormGroup>
                                            <label>Date Supplier Finish</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DateTradeFinish"
                                                    name="DateTradeFinish"
                                                    value={this.state.DateTradeFinish}
                                                    onChange={this.setDateTradeScheduled}
                                                />
                                            </FormGroup>

                                            <label>Supplier Job Description</label>
                                            <FormGroup>
                                                <textarea className="form-control" type="text" value={this.state.SupplierJobDescription} onChange={this.setSupplierJobDescription} />
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

                                        <Collapse isOpen={this.state.Equipment === true}>
                                            <label>Date of Purchased Equipment</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DatePurcharsedEquipment"
                                                    name="DatePurcharsedEquipment"
                                                    value={this.state.DatePurcharsedEquipment}
                                                    onChange={this.setDatePurcharsedEquipment}
                                                />
                                            </FormGroup>
                                            <label>Supplier</label>
                                            <FormGroup>
                                                <Select
                                                    options={optionsListProductSuppliers}
                                                    selected={this.state.supplierProductListSelected}
                                                    onSelectedChanged={supplierProductListSelected => this.setState({ supplierProductListSelected })}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <FormGroup check className="form-check-radio" inline>
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="RepairRadios" value="1" checked={this.state.DeliveryEquipment === 1} onChange={DeliveryEquipment => this.setState({ DeliveryEquipment: 1 })} />
                                                        Delivery
<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check className="form-check-radio" inline>
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="RepairRadios" value="2" checked={this.state.DeliveryEquipment === 2} onChange={DeliveryEquipment => this.setState({ DeliveryEquipment: 2 })} />
                                                        Pick Up
<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                            </FormGroup>
                                        </Collapse>
                                    </blockquote>

                                    <blockquote className="blockquote">
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
                                        <Collapse isOpen={this.state.Parts === true}>
                                            <label>Date of Purchased Parts</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DateOfPurchasedPart"
                                                    name="DateOfPurchasedPart"
                                                    value={this.state.DateOfPurchasedPart}
                                                    onChange={this.setDateOfPurchasedPart}
                                                />
                                            </FormGroup>
                                            <label>Supplier</label>
                                            <FormGroup>
                                                <FormGroup>
                                                    <Select
                                                        options={optionsListProductSuppliers}
                                                        selected={this.state.supplierPartsListSelected}
                                                        onSelectedChanged={supplierPartsListSelected => this.setState({ supplierPartsListSelected })}
                                                    />
                                                </FormGroup>
                                            </FormGroup>
                                            <FormGroup>
                                                <FormGroup check className="form-check-radio" inline>
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="SupplierDeliveryPart" value="1" checked={this.state.SupplierDeliveryPart === 1} onChange={Repair => this.setState({ SupplierDeliveryPart: 1 })} />
                                                        Delivery
<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check className="form-check-radio" inline>
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="SupplierDeliveryPart" value="2" checked={this.state.SupplierDeliveryPart === 2} onChange={SupplierDeliveryPart => this.setState({ SupplierDeliveryPart: 2 })} />
                                                        Pick Up
<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                            </FormGroup>
                                        </Collapse>
                                    </blockquote>






























                                    <blockquote className="blockquote">
                                        <label>Path and Paint</label>
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
                                            <label>Date Scheduled</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date scheduling",
                                                    }}
                                                    id="DatePathandPaintStart"
                                                    name="DatePathandPaintStart"
                                                    value={this.state.DatePathandPaintStart}
                                                    onChange={this.setDatePathandPaintStart}
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
                                                    value={this.state.DatePathandPaintEnd}
                                                    onChange={this.setDatePathandPaintEnd}
                                                />
                                            </FormGroup>
                                        </Collapse>
                                    </blockquote>


                                    <blockquote className="blockquote">
                                        <h5>Final - Walk Thru</h5>
                                        <FormGroup>
                                            <label>Who</label>
                                            <FormGroup>
                                                <Select
                                                    options={optionsUserWalk}
                                                    selected={this.state.ProjectFinalManager}
                                                    onSelectedChanged={ProjectFinalManager => this.setState({ ProjectFinalManager })}
                                                />
                                            </FormGroup>
                                        </FormGroup>
                                        <label>Date Walk Thru Scheduled</label>
                                        <FormGroup>
                                            <ReactDatetime
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "Date scheduling",
                                                }}
                                                id="DateWalkthruSchedule"
                                                name="DateWalkthruSchedule"
                                                value={this.state.DateWalkthruSchedule}
                                                onChange={this.setDateWalkthruSchedule}
                                            />
                                        </FormGroup>


                                        <label>Date Walk Thru Finish</label>
                                        <FormGroup>
                                            <ReactDatetime
                                                inputProps={{
                                                    className: "form-control",
                                                    placeholder: "Date scheduling",
                                                }}
                                                id="DateFinalWalkthruExecution"
                                                name="DateFinalWalkthruExecution"
                                                value={this.state.DateFinalWalkthruExecution}
                                                onChange={this.setDateFinalWalkthruExecution}
                                            />
                                        </FormGroup>

                                        <label>Walk Thru Information</label>
                                        <FormGroup>
                                            <textarea className="form-control" type="text" value={this.state.WalkFinalInformation || ''} onChange={this.setWalkFinalInformation} />
                                        </FormGroup>
                                    </blockquote>











                                </Form>

                                <Button className="btn-fill" color="success" onClick={this.updateCustomer} disabled={!this.state.ScheduleId}>
                                    Save Editions
                  </Button>
                                <Button className="btn-fill" color="warning" onClick={this.cancelForm} disabled={!this.state.ScheduleId}>
                                    Cancel
                  </Button>










                            </CardBody>
                        </Card>
                    </Col>











                    <Col md="6">
                        <Card>
                            <CardBody>




                                <blockquote className="blockquote">
                                    <label>Date Plan Start Job</label>
                                    <FormGroup>
                                        <ReactDatetime
                                            inputProps={{
                                                className: "form-control",
                                                placeholder: "Date scheduling",
                                            }}
                                            id="DateStart"
                                            name="DateStart"
                                            value={this.state.DateScheduled}
                                            onChange={this.setDateScheduled}

                                        />
                                    </FormGroup>
                                    <label>Date Plan Finish Job</label>
                                    <FormGroup>
                                        <ReactDatetime
                                            inputProps={{
                                                className: "form-control",
                                                placeholder: "Date scheduling",
                                            }}
                                            id="DateStart"
                                            name="DateStart"
                                            value={this.state.DateScheduledEnd}
                                            onChange={this.setDateScheduledEnd}
                                        />
                                    </FormGroup>


 

                                    <label>Date Start Execution</label>
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
                                    <label>Date Finish</label>
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

                                    <label>Installer Note</label>
                                    <FormGroup>
                                        <textarea className="form-control" type="text" value={this.state.InstallerNote} onChange={this.setInstallerNote} />
                                    </FormGroup>

        
                                </blockquote>






                                <blockquote className="blockquote">
                                <label>Team</label>
                                    <FormGroup>
                                        <MultiSelect
                                            options={optionsGroupsUserListInstaller}
                                            selected={this.state.installersGroupsUserListInstaller}
                                            onSelectedChanged={installersGroupsUserListInstaller => this.setState({ installersGroupsUserListInstaller })}
                                        />
                                    </FormGroup>

                                    <Col md="1" sm="1">
                                        <Button className="btn-icon btn-round" color="success" onClick={this.createTeam}>
                                            <i className="far fa-user" />
                                        </Button>
                                    </Col>
                                </blockquote>





                                <blockquote className="blockquote">
                                    <Card>
                                        {this.state.alert}
                                        <CardHeader>
                                            <CardTitle tag="h4">Resume</CardTitle>
                                        </CardHeader>
                                        <CardBody>

                                            <h3><b>Customer Name:</b> {this.state.CustomerName} </h3>
                                            <h3><b>Address:</b> {this.state.Address}{" "}{this.state.City}</h3>



                                            <h3><b>Team:</b> {this.state.installersGroupsUserListInstaller}</h3>

                                        </CardBody>
                                    </Card>


                                </blockquote>

                            </CardBody>
                        </Card>
                    </Col>









                    <Col md="6">

                    </Col>






























                    <Col xs={12} md={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Customer Job List</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <ApolloProvider client={client}>

                                    <Query query={getScheduleList}>

                                        {({ data, error, loading }) => {
                                            if (error) return '💩 Oops!';
                                            if (loading) return 'Patience young grasshopper...';

                                            return (
                                                <div>
                                                    <ReactTable data={data.schedules}
                                                        columns={columns}

                                                        filterable
                                                        defaultPageSize={10}
                                                        className="-striped -highlight"
                                                    //getTdProps={(state, rowInfo, column, instance) => {
                                                    // if (rowInfo === undefined) {
                                                    //      return {}; // for blank rows...
                                                    //  }
                                                    // rowInfo.field = column.id;
                                                    //  return {};
                                                    // }}
                                                    />
                                                </div>
                                            );
                                        }}
                                    </Query>

                                </ApolloProvider>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>


            </div >
        );
    }
}
export default BackOffice;