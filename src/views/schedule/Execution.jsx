import React from 'react';
import moment from "moment";
import ReactTable from "react-table";
import ReactDatetime from "react-datetime";
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from "react-select";

import { ApolloProvider, Query, Mutation } from 'react-apollo';
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
  Table,
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

const getGroupsUsers = gql`
query getGroupList($first: Int, $offset: Int) {
	groups(first: $first, offset: $offset) {
		GroupId
		Role
		Desc
		users {
			id
			name
			email
		}
	}
}
`
const getTeam = gql`
query getTeam($first: Int, $offset: Int) {
	executions(first: $first, offset: $offset) {
    ExecutionId
    CustomerName
    City
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
const createTeam = gql`
mutation createTeam($teamInput: TeamInput!) {
	createTeam,(input: $teamInput) {
		ExecutionId
    id
	}
}
`
const deleteTeam = gql`
mutation deleteTeam($teamInput: TeamInput!) {
	deleteTeam(input: $teamInput) 
}
`

class Execution extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {

      id: '',
      ScheduleId: '',
      CustomerName: '',
      Address: '',
      City: '',

      ExecutionId: '',
      InstallerNote: '',

      //LISTAS
      GroupsUserList: [],
      groupUserListSelected: [],
      GroupsUserListInstaller: [],
      GroupsUserListInstallerSelected: [],

      installersGroupsUserListInstaller: '',
      expanded: {},
      rowSelected: {},
      alert: null,
    };

    this.getGroupsUserList = this.getGroupsUserList.bind(this);
    this.successCreatedAlert = this.successCreatedAlert.bind(this);
    this.hideAlert = this.hideAlert.bind(this);
    this.selectEdit = this.selectEdit.bind(this);
    this.createTeam = this.createTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
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
          if (listaGrupo[i].groups[j].GroupId == 2) {
            this.setState({ GroupsUserListInstaller: listaGrupo[i].groups[j].users })
          }
        }
      }



    }).catch(error => {
      this.setState({ msg: error.message });
    });
  }

  getTeam(idLink) {

    this.setState({
      ExecutionId: idLink
    });

    client.query({
      query: getTeamById,
      variables: { id: idLink },
    }).then(res => {
      var listaTeam = [res.data];
      for (var i = 0; i < listaTeam.length; i++) {
        for (var j = 0; j < listaTeam[i].team.length; j++) {
          this.setState({ GroupsUserListInstallerSelected: listaTeam[i].team[j].teams })
        }
      }
    }).catch(error => {
      this.setState({ msg: error.message });
    });
  }

  createTeam() {


    var teamInput = {
      id: this.state.installersGroupsUserListInstaller.value,
      ExecutionId: this.state.ExecutionId,
    }

    client.mutate({
      mutation: createTeam,
      variables: { teamInput },

      //  optimisticResponse: {},
      refetchQueries: () => [{ query: getTeam, variables: { id: this.state.ExecutionId } }]
    }).then(res => {
      this.successCreatedAlert();
    }).catch(error => {
      this.setState({ msg: error.message });
    });


  }

  deleteTeam(x) {

                                                                                               

    var teamInput = {
      id: x.original.id,
      ExecutionId: this.state.ExecutionId,
    }

    console.log(x);

    client.mutate({
      mutation: deleteTeam,
      variables: { teamInput },
      optimisticResponse: {},
      //refetchQueries: () => [{ query: getTeamById, variables: { id: this.state.ExecutionId } }]
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

    this.getTeam(props.original.ExecutionId);

  }

  componentDidMount() {
    this.getGroupsUserList()
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
        Header: "Actions",
        Cell: props => {
          return (
            <div>
              <Button className="btn-icon btn-simple" color="success" size="sm" onClick={() => { this.selectEdit(props) }}>
                <i className="fa fa-user" />
              </Button>{` `}
              {this.state.msg}
            </div>
          )
        }
      },
      {
        Header: "Date Schedule",
        accessor: "DateScheduled",
      },
      {
        Header: "Date Schedule End",
        accessor: "DateScheduledEnd",
      },
      {
        Header: "Customer Name",
        accessor: "CustomerName",
      },
      {
        Header: "Customer City",
        accessor: "City",
      },
    ];


    var columnsSub = [
      {
        Header: "Actions",
        Cell: props => {
          return (
            <div>

              <Button className="btn-icon btn-simple" color="danger" size="sm" onClick={() => { this.deleteTeam(props) }} disabled={this.state.ExecutionId == ''}>
                <i className="fa fa-trash-alt" />
              </Button>{` `}
              {this.state.msg}
            </div>
          )
        }
      },

      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },

    ];

    let optionsGroupsUserListInstaller = this.state.GroupsUserListInstaller.map(function (installers) {
      return { value: installers.id, label: installers.name };
    })


    return (
      <>
        <div className="content">

          <Row>

            <Col md="6">
              <Collapse isOpen={this.state.ExecutionId > 0}>
                <Card>
                  <CardBody>
                    <h3><b>Execution Id:</b> {this.state.ExecutionId} </h3>
                    <blockquote className="blockquote">
                      <label>Team</label>
                      <FormGroup>

                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="singleSelect"
                          value={this.state.installersGroupsUserListInstaller}
                          onChange={value =>
                            this.setState({ installersGroupsUserListInstaller: value })
                          }
                          options={optionsGroupsUserListInstaller}
                          placeholder="Team"
                        />



                      </FormGroup>
                      <Col md="1" sm="1">
                        <Button className="btn-icon btn-round" color="success" onClick={this.createTeam} disabled={!this.state.installersGroupsUserListInstaller}>
                          <i className="far fa-user" />
                        </Button>
                      </Col>
                    </blockquote>

                  </CardBody>
                </Card>
              </Collapse>
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
                    <Query query={getTeam}>
                      {({ data, error, loading }) => {
                        if (error) return '💩 Oops!';
                        if (loading) return 'Patience young grasshopper...';

                        return (
                          <div>

                            <ReactTable data={data.executions}
                              columns={columns}
                              filterable
                              defaultPageSize={10}

                            //      getTdProps={(state, rowInfo, column, instance) => {
                            //       if (rowInfo === undefined) {
                            //        return {}; // for blank rows...
                            //      }
                            //     rowInfo.field = column.id;
                            //     return {};
                            //   }}
                       
                             expanded={this.state.expanded}
                              onExpandedChange={expanded => this.setState({ expanded })}
                            SubComponent={row => {
                              return (
                                <div style={{ padding: "20px" }}>
                                  <em>
                                    List of schedules.
                                </em>
                                  <br />
                                  <br />
                                  <ReactTable

                                    data={row.original.teams}
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
export default Execution;