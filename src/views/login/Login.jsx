import React from "react";
import { browserHistory } from 'react-router';
import axios from "axios";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col
} from "reactstrap";

class Login extends React.Component {

  constructor(props) {
    super();
    this.state = {
      Email: '',
      Password: ''
    };

    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }



  enviaLogin(evento) {
    evento.preventDefault();
    axios.post('http://localhost:8080/api/users/login', { Email: this.state.Email, Password: this.state.Password })
      .then(res => {
        alert("Good Job!");
        return res.json();
      })
      .catch(error => {
        console.log(error);
      });
  }



  setUserName(evento) {
    this.setState({ Email: evento.target.value });
  }

  setPassword(evento) {
    this.setState({ Password: evento.target.value });
  }

  componentDidMount() {
    document.body.classList.toggle("login-page");
  }

  componentWillUnmount() {
    document.body.classList.toggle("login-page");

    browserHistory.push('/');
  }

  render() {
    return (
      <>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form className="form" onSubmit={this.enviaLogin.bind(this)}>
                <Card className="card-login card-white">
                  <CardHeader>
                    <img
                      alt="..."
                      src={require("assets/img/card-primary.png")}
                    />
                    <CardTitle tag="h1">Log in</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-email-85" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Email" type="text" value={this.state.Email} onChange={this.setUserName} />
                    </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-lock-circle" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Password" type="password" value={this.state.Password} onChange={this.setPassword} />
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="mb-3"
                      color="primary"
                      value="login"
                      size="lg"
                    >
                      Get Started
                    </Button>
                    <div className="pull-left">
                      <h6>
                        <a
                          className="link footer-link"


                        >
                          Create Accountd
                        </a>
                      </h6>
                    </div>
                    <div className="pull-right">
                      <h6>
                        <a
                          className="link footer-link"


                        >
                          Need Help?
                        </a>
                      </h6>
                    </div>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </>
    );
  }


  handleChange(e) {
    this.setState(
      {
        [e.target.name]: e.target.value
      }
    )
  }





}

export default Login;
