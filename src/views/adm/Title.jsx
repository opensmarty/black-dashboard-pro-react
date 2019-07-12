import React, { Component } from "react";
import classNames from "classnames";
import $ from 'jquery';
import ReactTable from "react-table";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Form,
    Label,
    Input,
    CardFooter,
    FormGroup,
    Button
} from "reactstrap";

class Title extends React.Component {
    constructor() {
        super();
        this.state = {
            JobTitle: ''
                 
        };
        this.enviaForm = this.enviaForm.bind(this);
        this.setJobTitle = this.setJobTitle.bind(this);  
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'http://localhost:8080/api/title/',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ JobTitle: this.state.JobTitle }),
            success: function (novaresposta) {
                this.listaTitle(novaresposta);
            }.bind(this),
            error: function (title) {
                console.log("erro");
            }
        });
    }

    setJobTitle(evento) {
        this.setState({ JobTitle: evento.target.value });
    }

    listaTitle() {
        $.ajax({
            url: "http://localhost:8080/api/alltitle/",
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });







            }.bind(this)
        });
    };

    componentDidMount() {

        this.listaTitle();
    }


    render() {
        const { lista } = this.state;
        return (
            <>
                <div className="content">
                    <Row className="mt-5">
                        <Col md="5">
                            <Card >
                                <CardHeader>
                                    <CardTitle tag="h4">Title Form</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Form action="#" onSubmit={this.enviaForm}>
                                        <label>Job Title</label>
                                        <FormGroup>
                                            <Input type="text" id="JobTitle" name="JobTitle" value={this.state.JobTitle} onChange={this.setJobTitle} />
                                       
                                        </FormGroup>
                                        <Button className="btn-fill" color="primary" type="submit">
                                                Submit
                                    </Button>
                                    </Form>
                                </CardBody>

                            </Card>
                        </Col>
                        <Col xs={12} md={12}>
                            <Card>
                                <CardHeader>
                                    <CardTitle tag="h4">Title List</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <ReactTable
                      
                                        resizable={false}
                                        data={lista}
                                        noDataText="Someone did not register."
                                        columns={[
                                            {
                                                columns: [
                                                    {
                                                        Header: "TitleId",
                                                        accessor: "TitleId",
                                                    },

                                                ]
                                            },
                                            {
                                                columns: [
                                                    {
                                                        Header: "Job Title",
                                                        accessor: "JobTitle",
                                                    },

                                                ]
                                            },
                                            {
                                                Header: "Actions",
                                                accessor: "actions",
                                                sortable: false,
                                                filterable: false
                                              }
                                        ]}
                                        defaultPageSize={10}
                                        showPaginationTop
                                        showPaginationBottom={false}
                                        className="-striped -highlight"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <br />


              
                </div>
            </>
        );
    }
}

export default Title;





