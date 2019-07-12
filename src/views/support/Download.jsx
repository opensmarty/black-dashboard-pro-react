import React from "react";
import axios from "axios";
import moment from "moment";
import Moment from "react-moment";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// reactstrap components
import {
    BreadcrumbItem,
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardText,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Progress,
    Table,
    Row,
    Col,
    UncontrolledTooltip
} from "reactstrap";

class Download extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    //Ao abrir a página executará funções
    componentDidMount() {

    }

    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <ol className="breadcrumb bg-transparent ml-3">
                            <BreadcrumbItem>
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    Home
                </a>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <a href="#pablo" onClick={e => e.preventDefault()}>
                                    {" "}
                                    Schedule
                </a>
                            </BreadcrumbItem>
                            <BreadcrumbItem className="active">Plan</BreadcrumbItem>
                        </ol>

                        <Col xs={12} md={12}>

                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th className="text-left">#</th>
                                        <th>Name</th>
                                        <th>Process</th>
                                        <th>Version</th>
                                        <th>Date Created</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                        <Button className="btn-icon btn-simple" color="success" size="sm" href="files/CheckList_Attic.pdf">
                                            <i className="fa fa-file-pdf"></i>
                                        </Button>{` `} 
                                        </td>
                                        <td>Checklist - Attic</td>
                                        <td>Wack Thru</td>   
                                        <td>V 1.0</td>  
                                        <td>July 04 2019</td>                       
                                    </tr>

                                    <tr>
                                        <td>
                                        <Button className="btn-icon btn-simple" color="success" size="sm" href="files/CheckList_Attic.pdf">
                                            <i className="fa fa-file-pdf"></i>
                                        </Button>{` `}                 
                                        </td>
                                        <td>Checklist - Basement</td>
                                        <td>Wack Thru</td>   
                                        <td>V 1.0</td>  
                                        <td>July 04 2019</td>                       
                                    </tr>

                                    <tr>
                                        <td>
                                        <Button className="btn-icon btn-simple" color="success" size="sm" href="files/CheckList_Attic.pdf">
                                            <i className="fa fa-file-pdf"></i>
                                        </Button>{` `}                 
                                        </td>
                                        <td>Checklist - Mini Split</td>
                                        <td>Wack Thru</td>   
                                        <td>V 1.0</td>  
                                        <td>July 04 2019</td>                       
                                    </tr>

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Download;
