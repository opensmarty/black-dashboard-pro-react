import React from "react";
// nodejs library that concatenates classes
import { Link } from 'react-router-dom'
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

import axios from 'axios';

import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';



// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
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

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.jsx";

//const AnyReactComponent = ({ text }) => <div>{text}</div>;

var mapData = {
  AU: 760,
  BR: 550,
  CA: 120,
  DE: 1300,
  FR: 540,
  GB: 690,
  GE: 200,
  IN: 200,
  RO: 600,
  RU: 300,
  US: 2920
};


const token = localStorage.getItem('auth-token');

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/graphql',

  headers: {
    Authorization: `bearer ${
      token
      }`,
    'Content-Type': 'application/json',
  },
});

const getScheduleList = `
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



class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }


    // binding this to event-handler functions
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onMapClick = this.onMapClick.bind(this);

    this.onFetchFromGitHub = this.onFetchFromGitHub.bind(this);
  }

  onFetchFromGitHub = async () => {



    axiosClient
      .get('', { query: getScheduleList })
      .then(result => console.log("teste", result));
  };





  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClick = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  }
  Í


  componentDidMount() {
    console.log(window.localStorage.getItem('auth-token'));
    console.log(window.localStorage.getItem('auth-user-in'));

    this.onFetchFromGitHub();

  }

  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };

  render() {
    const style = {
      width: '50vw',
      height: '75vh',
      'marginLeft': 'auto',
      'marginRight': 'auto'
    }

    return (


      <>
        <div className="content">
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>

                  <Row>


                  </Row>
                </CardHeader>
                <CardBody>

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
