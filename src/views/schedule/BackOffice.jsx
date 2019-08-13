import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import ReactDatetime from "react-datetime";
import SweetAlert from 'react-bootstrap-sweetalert';
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
        FollowUp
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

const getAllSericeSuppliers = gql`
query getAllSericeSuppliers($first: Int, $offset: Int) {
	suppliers(first: $first, offset: $offset) {
		SupplierId
        Name
        Type
	}
}
`



class BackOffice extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

            ScheduleId: '',
            ConcretePad: 1,
            Permit: false,
            Supplier: false,
            Parts: false,
            Equipment: false,




            WalkInformation: '',
            DateWalkthruSchedule: null,
            DateWalkthruExecution: null,


            //LISTAS
            GroupsUserList: [],
            groupUserListSelected: [],

            PermitTypeList: [],
            permitTypeListSelected: [],

            SupplierServiceList: [],
            supplierServiceListSelected: [],
        };

        this.selectEdit = this.selectEdit.bind(this);

        this.setConcretePad = this.setConcretePad.bind(this);
        this.setPermit = this.setPermit.bind(this);
        this.setSupplier = this.setSupplier.bind(this);
        this.setParts = this.setParts.bind(this);
        this.setEquipment = this.setEquipment.bind(this);
        this.setWalkInformation = this.setWalkInformation.bind(this);


        this.setDateWalkthruSchedule = this.setDateWalkthruSchedule.bind(this);
        this.setDateWalkthruSchedule = this.setDateWalkthruSchedule.bind(this);
        this.getGroupsUserList = this.getGroupsUserList.bind(this);
        this.getAllTypesPermits = this.getAllTypesPermits.bind(this);
        this.getAllServiceSuppliers = this.getAllServiceSuppliers.bind(this);

        
    }


    setWalkInformation(evento) {
        this.setState({ WalkInformation: evento.target.value });
    }

    setConcretePad(evento) {
        this.setState({ ConcretePad: evento.target.value });
    }

    setPermit(evento) {
        this.setState({ Permit: !this.state.Permit });
    }

    setSupplier(evento) {
        this.setState({ Supplier: !this.state.Supplier });
    }

    setParts(evento) {
        this.setState({ Parts: !this.state.Parts });
    }

    setEquipment(evento) {
        this.setState({ Equipment: !this.state.Equipment });
    }


    setDateWalkthruSchedule(evento) {
        this.setState({ DateWalkthruSchedule: moment(evento) });
    }

    setDateWalkthruExecution(evento) {
        this.setState({ DateWalkthruExecution: moment(evento) });
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
                    }
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

    getAllServiceSuppliers() {
        client.query({
            query: getAllSericeSuppliers,
            optimisticResponse: {},
        }).then(res => {


            var listaSuppliers = [res.data];



            console.log(res);


            for (var i = 0; i < listaSuppliers.length; i++) {



 

               // if (listaSuppliers[i].Type == 1) {
                this.setState({ SupplierServiceList: listaSuppliers[i].suppliers });
        //    }
            }
        }).catch(error => {
            this.setState({ msg: error.message });
        });
    }





    //Select the schedule for update
    selectEdit(props) {
        this.setState({
            ScheduleId: props.original.ScheduleId,
        });
    }


    componentDidMount() {
        this.getGroupsUserList();
        this.getAllTypesPermits();
        this.getAllServiceSuppliers();
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

        let optionsListServiceSuppliers = this.state.SupplierServiceList.map(function (supplier) {
            return { value: supplier.SupplierId, label: supplier.Name };
        })

        return (
            <div className="content">
                <Row className="mt-12">
                    <Col md="5">
                        <Card >
                            {this.state.alert}
                            <CardHeader>
                                <CardTitle tag="h4">Backoffice</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <h4><b>Customer Name:</b> {this.state.CustomerName} </h4>
                                <h4><b>Address</b> {this.state.Address} </h4>

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
                                        <label>Who</label>
                                        <FormGroup>
                                            <MultiSelect
                                                options={optionsUserWalk}
                                                selected={this.state.groupUserListSelected}
                                                onSelectedChanged={groupUserListSelected => this.setState({ groupUserListSelected })}
                                            />
                                        </FormGroup>
                                        <label>Walk Thru Information</label>
                                        <FormGroup>
                                            <textarea className="form-control" type="text" value={this.state.WalkInformation || ''} onChange={this.setWalkInformation} />
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

                                            <label>Data Walk Thru Scheduled</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date walk thru scheduling",
                                                    }}
                                                    id="DateWalkScheduled"
                                                    name="DateWalkScheduled"
                                                    value={this.state.DateWalkScheduled}
                                                    onChange={this.setDateWalkScheduled}
                                                />
                                            </FormGroup>

                                            <label>Data Finish</label>
                                            <FormGroup>
                                                <ReactDatetime
                                                    inputProps={{
                                                        className: "form-control",
                                                        placeholder: "Date walk done",
                                                    }}
                                                    id="DateWalk"
                                                    name="DateWalk"
                                                    value={this.state.DateWalk}
                                                    onChange={this.setDateWalk}
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


                                                <MultiSelect
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
                                            <MultiSelect
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
                                                    id="DateOfPurchasedEquip"
                                                    name="DateOfPurchasedEquip"
                                                    value={this.state.DateOfPurchasedEquip}
                                                    onChange={this.setDateOfPurchasedEquip}
                                                />
                                            </FormGroup>
                                            <label>Supplier</label>
                                            <FormGroup>

                                            </FormGroup>
                                            <FormGroup>
                                                <FormGroup check className="form-check-radio" inline>
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="RepairRadios" value="1" checked={this.state.SupplierDeliveryEquip === 1} onChange={SupplierDeliveryEquip => this.setState({ SupplierDeliveryEquip: 1 })} />
                                                        Delivery
<span className="form-check-sign"></span>
                                                    </Label>
                                                </FormGroup>
                                                <FormGroup check className="form-check-radio" inline>
                                                    <Label className="form-check-label">
                                                        <Input type="radio" name="RepairRadios" value="2" checked={this.state.SupplierDeliveryEquip === 2} onChange={SupplierDeliveryEquip => this.setState({ SupplierDeliveryEquip: 2 })} />
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
                                                value={this.state.Part}
                                                onChange={this.setPart}
                                                offColor="primary"
                                                offText="No"
                                                onColor="primary"
                                                onText="Yes"
                                            />{" "}
                                        </FormGroup>
                                        <Collapse isOpen={this.state.Equipment === true}>
                                            <label>Finish Step</label>
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
                                        <label>Date Schedule Execution</label>
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
                                        <h5>Final - Walk Thru</h5>
                                        <label>Who</label>
                                        <FormGroup>

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
                                                id="DateWalkthruExecution"
                                                name="DateWalkthruExecution"
                                                value={this.state.DateWalkthruExecution}
                                                onChange={this.setDateWalkthruExecution}
                                            />
                                        </FormGroup>

                                        <label>Walk Thru Information</label>
                                        <FormGroup>
                                            <textarea className="form-control" type="text" value={this.state.WalkInformation || ''} onChange={this.setWalkInformation} />
                                        </FormGroup>
                                    </blockquote>











                                </Form>

                                <Button className="btn-fill" color="info" type="submit" onClick={this.updateScheduleWalk}>
                                    Schedule Walk Thru
                  </Button>
                                <Button className="btn-fill" color="success" onClick={this.updateCustomer} disabled={!this.state.ScheduleId}>
                                    Save Editions
                  </Button>
                                <Button className="btn-fill" color="warning" onClick={this.cancelForm} disabled={!this.state.ScheduleId}>
                                    Cancel
                  </Button>









                                <Collapse isOpen={this.state.FollowUpId === 2}>
                                    <Form action="#" onSubmit={this.postWalkThru}>

                                    </Form>

                                    <Button className="btn-fill" color="info" type="submit" onClick={this.updateScheduleWalk}>
                                        Create New
</Button>
                                    <Button className="btn-fill" color="success" onClick={this.updateCustomer} disabled={!this.state.ScheduleId}>
                                        Save Editions
</Button>
                                    <Button className="btn-fill" color="warning" onClick={this.cancelForm} disabled={!this.state.ScheduleId}>
                                        Cancel
</Button>
                                </Collapse>





                            </CardBody>
                        </Card>
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