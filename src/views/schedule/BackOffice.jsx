import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import ReactTable from "react-table";
import ReactDatetime from "react-datetime";
import SweetAlert from 'react-bootstrap-sweetalert';
import MultiSelect from "@khanacademy/react-multi-select";


import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Collapse,
    Input,
    Row
} from "reactstrap";

class BackOffice extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

            //********************STEP 1 SOLD*******************//
            DateWalk: moment(),
            JobDescription: null,
            FollowUpId: '',

            //********************ARRAYS*******************//
            list: [],
            locations: [],
            locationsSelected: [],

        };

        this.setDateWalk = this.setDateWalk.bind(this);
        this.setJobDescription = this.setJobDescription.bind(this);

        this.selectEdit = this.selectEdit.bind(this);
        this.updateScheduleWalk = this.updateScheduleWalk.bind(this);
 
    }

    setDateWalk(evento) {
        this.setState({ DateWalk: moment(evento) });
    }

    setJobDescription(evento) {
        this.setState({ JobDescription: evento.target.value });
    }

    //Retorna os locais que podem ser instalados os sistemas
    ListLocations() {
        // axios.get('https://app-back-obie.herokuapp.com/api/schedule/getAllSelected/')
        axios.get('http://localhost:5000/api/schedule/location/')
            .then(res => {
                this.setState({ locations: res.data });
            })
            .catch(error => {
                console.log(error);
            });
    };

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


    //Select the schedule for update
    selectEdit(props) {
        this.setState({
            DateWalk: moment(props.original.DateWalk),
            JobDescription: props.original.JobDescription,
            FollowUpId: props.original.FollowUpId,
        });
    }

    //Post object for update schedule
    updateScheduleWalk(evento) {

        let data = {
            ScheduleId: this.state.ScheduleId,
            DateWalk: this.state.DateWalk,
            JobDescription: this.state.JobDescription,
            locationsSelected: this.state.locationsSelected       
        };

        evento.preventDefault();
        //axios.post('https://app-back-obie.herokuapp.com/api/schedule/update', data)
        axios.post('http://localhost:5000/api/schedule/customer/update/walkthruscheduled', data)
            .then(res => {
                this.ListCustomer();
                this.clearImputs(); //limpa campos//

            })
            .catch(error => {
                console.log(error);
            });
    }



    componentDidMount() {
        this.ListCustomer();
        this.ListLocations();
    }

    render(props) {

        //remodela o array de locais
        let optionsLocations = this.state.locations.map(function (location) {
            return { value: location.LocationId, label: location.Desc };
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

                                <h4><b>Contact Name:</b> {this.state.ContactName} </h4>
                                <h4><b>City:</b> {this.state.City} </h4>

                                <Collapse isOpen={this.state.FollowUpId === 1}>

                                    <Form action="#" onSubmit={this.updateScheduleWalk}>

                                        <blockquote className="blockquote">


                                            <label>Date Schedule Walk Thru</label>
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
                                                <textarea className="form-control" type="text" value={this.state.JobDescription || ''} onChange={this.setJobDescription} />
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

                                </Collapse>








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
export default BackOffice;