import React from 'react';
import moment from "moment";
import ReactTable from "react-table";
import ReactDatetime from "react-datetime";
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from "react-select";

import { ApolloProvider, Query } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { Alert } from 'react-bootstrap';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Collapse,
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

        executions {
          ExecutionId
          DateScheduled
          DateScheduledEnd
          DateStart
          DateEnd
          InstallerNote
        }

	}
}
`


const getTeamById = gql`
query getTeamById($id: ID!) {
	team(id: $id) {
		ExecutionId
		ScheduleId
    DateScheduled
    DateScheduledEnd
    DateStart
    DateEnd
		teams {
			id
			name
			email
		}
	}
}
`


const createExecution = gql`
mutation createExecution($executionInput: ExecutionInput!) {
	createExecution,(input: $executionInput) {
    ExecutionId
		CustomerName
    City
    ScheduleId
    DateScheduled
    DateScheduledEnd
    DateStart
    DateEnd
    Status
    InstallerNote
    teams{
      id
      name
    }
	}
}
`

const deleteExecution = gql`
mutation deleteExistingSchedule($executionInput: ExecutionInput!) {
	deleteExecution(input: $executionInput)
}
`

const updateExecution = gql`
mutation updateExecution($executionUpdateInput: ExecutionUpdateInput!) {
	updateExecution(input: $executionUpdateInput)
}
`

function MyCell({ value, columnProps: { rest: { someFunc } } }) {
  return <a href="#" onClick={someFunc}>{value}</a>
}


class RegisterSchedule extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

      id: '',
      ScheduleId: '',
      CustomerName: '',
      Address: '',
      City: '',

      ExecutionId: '',
      DateScheduled: null,
      DateScheduledEnd: null,
      DateStart: null,
      DateEnd: null,
      InstallerNote: '',

      //LISTAS


      expanded: {},
      rowSelected: {},
      alert: null,
    };

    this.setDateScheduled = this.setDateScheduled.bind(this);
    this.setDateScheduledEnd = this.setDateScheduledEnd.bind(this);
    this.setDateStart = this.setDateStart.bind(this);
    this.setDateEnd = this.setDateEnd.bind(this);
    this.setInstallerNote = this.setInstallerNote.bind(this);
    this.successCreatedAlert = this.successCreatedAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.selectEdit = this.selectEdit.bind(this);
    this.deleteExecution = this.deleteExecution.bind(this);
    this.updateExecution = this.updateExecution.bind(this);
    this.createExecution = this.createExecution.bind(this);
    this.cleanExecution = this.cleanExecution.bind(this);

  }



  setDateScheduled(evento) {
    this.setState({ DateScheduled: moment(evento) });
  }

  setDateScheduledEnd(evento) {
    this.setState({ DateScheduledEnd: moment(evento) });
  }

  setDateStart(evento) {
    this.setState({ DateStart: moment(evento) });
  }

  setDateEnd(evento) {
    this.setState({ DateEnd: moment(evento) });
  }

  setInstallerNote(evento) {
    this.setState({ InstallerNote: evento.target.value });
  }

  createExecution() {

    var executionInput = {
      CustomerName: this.state.CustomerName,
      City: this.state.City,
      ScheduleId: this.state.ScheduleId,
      DateScheduled: moment(this.state.DateScheduled),
      DateScheduledEnd: moment(this.state.DateScheduledEnd),
      DateStart: moment(this.state.DateStart),
      DateEnd: moment(this.state.DateEnd),
      InstallerNote: this.state.InstallerNote
    }

    client.mutate({
      mutation: createExecution,
      variables: { executionInput },
      optimisticResponse: {},




      refetchQueries: () => [{ query: getScheduleList }]

    }).then(res => {
      this.successCreatedAlert();
    }).catch(error => {
      this.setState({ msg: error.message });
    });

  }

  deleteExecution(props) {

    var executionInput = {
      ExecutionId: props.original.ExecutionId,
    }

    client.mutate({
      mutation: deleteExecution,
      variables: { executionInput },
      optimisticResponse: {},
      refetchQueries: () => [{ query: getScheduleList }]

    }).then(res => {

      this.successCreatedAlert();
    }).catch(error => {
      this.setState({ msg: error.message });
    });
  }

  updateExecution(props) {
    var executionUpdateInput = {
      DateScheduled: moment(this.state.DateScheduled),
      DateScheduledEnd: moment(this.state.DateScheduledEnd),
      DateStart: moment(this.state.DateStart),
      DateEnd: moment(this.state.DateEnd),
      InstallerNote: this.state.InstallerNote,
      ExecutionId: this.state.ExecutionId
    }


    console.log(executionUpdateInput);


    client.mutate({
      mutation: updateExecution,
      variables: { executionUpdateInput },
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
      ExecutionId: props.original.ExecutionId,
      id: this.state.installersGroupsUserListInstaller,
      DateScheduled: moment(props.original.DateScheduled),
      DateScheduledEnd: moment(props.original.DateScheduledEnd),
      DateStart: moment(props.original.DateStart),
      DateEnd: moment(props.original.DateEnd),
      InstallerNote: props.original.InstallerNote,
    });


  }


  //Select the schedule for update
  cleanExecution() {

    this.setState({
      id: '',
      ScheduleId: '',
      CustomerName: '',
      Address: '',
      City: '',

      ExecutionId: '',
      DateScheduled: null,
      DateScheduledEnd: null,
      DateStart: null,
      DateEnd: null,
      InstallerNote: '',
    });


  }

  componentDidMount() {

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
          Team created successfully!
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

    var columns = [

      {
        Header: "Job Select",
        accessor: "ScheduleId",
        Cell: props => {
          return (


            <div>
              <a href={'#'} size="sm" onFocus={() => { this.setState({ ScheduleId: props.original.ScheduleId, CustomerName: props.original.CustomerName, City: props.original.City }) }}>
                <i>{props.original.ScheduleId}</i> {"  o/  "} <i className="fa fa-mouse-pointer fa-1x" />
              </a>{` `}
            </div>
          )
        }
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
      {
        Header: "Address",
        accessor: "Address",
      },
      {
        Header: "Date Sold",
        accessor: "DateSold",
      },
    ];

    var columnsSub = [
      {
        Header: "Actions",
        Cell: props => {
          return (
            <div>
              <Button className="btn-icon btn-simple" color="success" size="sm" onClick={() => { this.selectEdit(props) }}>
                <i className="fa fa-hand-pointer" />
              </Button>{` `}
              <Button className="btn-icon btn-simple" color="danger" size="sm" onClick={() => { this.deleteExecution(props) }}>
                <i className="fa fa-trash-alt" />
              </Button>{` `}
              {this.state.msg}
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
                color: this.state.GroupsUserListInstallerSelected == null ? '#FF0000'
                  // : schedule.Status === 2 ? '#ffbf00'
                  : '#57d500',
                transition: 'all .3s ease'
              }}>
                &#x25cf;
      </span> {
                this.state.GroupsUserListInstallerSelected == null ? 'Pending'
                  // : schedule.Status === 2 ? `Pending Approval`
                  : 'All set'
              }
            </span>
          )
        }
      },


      {
        Header: "DateScheduled",
        accessor: "DateScheduled",
      },
      {
        Header: "DateScheduledEnd",
        accessor: "DateScheduledEnd",
      },
      {
        Header: "DateStart",
        accessor: "DateStart",
      },
      {
        Header: "DateEnd",
        accessor: "DateEnd",
      },
    ];


    return (
      <>
        <div className="content">

          <Row>

            <Col md="12">
              <Card >
                {this.state.alert}
                <CardHeader>
                  <CardTitle tag="h4">Backoffice</CardTitle>
                </CardHeader>
                <CardBody>
                  <h3><b>Customer Name:</b> {this.state.CustomerName} </h3>
                  <h3><b>City:</b> {this.state.City} </h3>
                  <h3><b>Execution Id:</b> {this.state.ExecutionId} </h3>
                </CardBody>
              </Card >
            </Col>
          </Row>


          <Row>
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
                  <Button className="btn-fill" id="create" color="info" type="submit" onClick={this.createExecution} disabled={!this.state.ScheduleId}>
                    Create New
                  </Button>

                  <Button className="btn-fill" color="success" onClick={this.updateExecution} disabled={!this.state.ExecutionId}>
                    Save Editions
                  </Button>
                  <Button className="btn-fill" color="warning" onClick={this.cancelForm} disabled={!this.state.ExecutionId}>
                    Cancel
                  </Button>

                </CardBody>
              </Card>
            </Col>
          
          </Row>
          <Row>
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


                            <pre>
                              <code>
                                <strong>this.state ===</strong>{" "}
                                {JSON.stringify(this.state.rowSelected, null, 2)}
                              </code>
                            </pre>



                            <ReactTable data={data.schedules}
                              columns={columns}
                              filterable
                              defaultPageSize={10}


                              expanded={this.state.expanded}
                              onExpandedChange={expanded => this.setState({ expanded })}

                              //      getTdProps={(state, rowInfo, column, instance) => {
                              //       if (rowInfo === undefined) {
                              //        return {}; // for blank rows...
                              //      }
                              //     rowInfo.field = column.id;
                              //     return {};
                              //   }}
                              SubComponent={row => {
                                return (
                                  <div style={{ padding: "20px" }}>
                                    <em>
                                      List of schedules.
                                </em>
                                    <br />
                                    <br />
                                    <ReactTable

                                      data={row.original.executions}
                                      columns={columnsSub}
                                      defaultPageSize={10}
                                      className="-striped -highlight"
                                      showPagination={false}
                                    />
                                  </div>
                                );
                              }}
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
      </>
    );
  }
}
export default RegisterSchedule;