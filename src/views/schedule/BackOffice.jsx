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

        };

        this.selectEdit = this.selectEdit.bind(this);

        this.setConcretePad = this.setConcretePad.bind(this);
        this.setPermit = this.setPermit.bind(this);
        this.setSupplier = this.setSupplier.bind(this);
        this.setParts = this.setParts.bind(this);
        this.setEquipment = this.setEquipment.bind(this);


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

    //Select the schedule for update
    selectEdit(props) {
        this.setState({
            ScheduleId: props.original.ScheduleId,
        });
    }


    componentDidMount() {


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

        //remodela o array de locais
        //  let optionsLocations = this.state.locations.map(function (location) {
        //     return { value: location.LocationId, label: location.Desc };
        //  })

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

                                        <label>Walk Thru Information</label>
                                        <FormGroup>
                                            <textarea className="form-control" type="text" value={this.state.WalkInformation || ''} onChange={this.setWalkInformation} />
                                        </FormGroup>
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