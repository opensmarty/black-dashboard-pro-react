import React from "react";
import $ from 'jquery';

// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
import logo from "assets/img/logo.png";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

class Register extends React.Component {


  constructor() {
    super();
    this.state = {
      Name: '',
      Email: '',
      Password: '',
      Alert: null
    };


    this.createUser = this.createUser.bind(this);
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);

  }

  setName(evento) {
    this.setState({ Name: evento.target.value });
  }

  setEmail(evento) {
    this.setState({ Email: evento.target.value });
  }

  setPassword(evento) {
    this.setState({ Password: evento.target.value });
  }


  basicAlert = () => {

    console.log('funcionou');

    this.setState({
      Alert: (
        <ReactBSAlert
          style={{ display: "block", marginTop: "-100px" }}
          title="Here's a message!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="success"
          btnSize=""
        />
      )
    });
  };



  teste(evento) {


    evento.preventDefault();
    fetch('http://localhost:8080/api/users/create', {
      method: 'post',
      body: JSON.stringify({ Name: this.state.Name, Email: this.state.Email, Password: this.state.Password }),
    }).then(function(response) {
      return response.json(); 
    }).then(function(data) {
      console.log(data)
    });
  }


  createUser(evento) {




    evento.preventDefault();
    $.ajax({
      url: 'http://localhost:8080/api/users/create',
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({ Name: this.state.Name, Email: this.state.Email, Password: this.state.Password }),

      success: function (message, status) {
        console.log(message)

      }.bind(this),
      error: function () {
        console.log("erro");
      }
    });
  }




  componentDidMount() {
    document.body.classList.toggle("register-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }
  render() {
    return (
      <>
        <div className="content">
          <Container>
            <Row>
              <Col className="ml-auto" md="5">
                <div className="info-area info-horizontal mt-5">
                  <div className="icon icon-warning">
                    <i className="tim-icons icon-key-25" />
                  </div>
                  <div className="description">
                    <h3 className="info-title">Password</h3>
                    <p className="description">
                      Do not share your password.
                    </p>
                  </div>
                </div>
                <div className="info-area info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-badge" />
                  </div>
                  <div className="description">
                    <h3 className="info-title">Personal data.</h3>
                    <p className="description">
                      Remember to update your personal information.
                    </p>
                  </div>
                </div>
                <div className="info-area info-horizontal">
                  <div className="icon icon-info">
                    <i className="tim-icons icon-alert-circle-exc" />
                  </div>
                  <div className="description">
                    <h3 className="info-title">Notifications</h3>
                    <p className="description">
                      Be aware of notifications.
                    </p>
                  </div>
                </div>
              </Col>
              <Col className="mr-auto" md="7">
                <Card className="card-register card-white">
                  <CardHeader>
                    <CardImg
                      alt="..."
                      src={require("assets/img/card-primary.png")}
                    />
                    <CardTitle tag="h4">Register</CardTitle>                
                  </CardHeader>
                  <CardBody>
                    <Form className="form" onSubmit={this.createUser}>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-single-02" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Full Name" type="text" value={this.state.Name} onChange={this.setName} />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Email" type="text" value={this.state.Email} onChange={this.setEmail} />
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="tim-icons icon-lock-circle" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Password" type="text" value={this.state.Password} onChange={this.setPassword} />
                      </InputGroup>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input type="checkbox" />
                          <span className="form-check-sign" />I agree to the{" "}
                          <a href="#pablo" onClick={e => e.preventDefault()}>
                            terms and conditions
                          </a>
                          .
                        </Label>
                      </FormGroup>
                    </Form>
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="btn-round"
                      color="primary"
                      href="#pablo"
                      onClick={this.teste}
                      size="lg"
                      type="submit"
                    >
                      Get Started
                    </Button>

                    <img src={logo} align="right"></img>

                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default Register;
