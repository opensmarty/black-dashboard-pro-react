import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { browserHistory } from 'react-router';
import axios from "axios";
import { render } from 'react-dom'


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
      Password: '',
      msg: ''
    };

    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  // send form for validation the login
  enviaLogin(evento) {

    evento.preventDefault();
     
    

    axios.post('https://app-back-obie.herokuapp.com/api/users/login', { Email: this.state.Email, Password: this.state.Password })
    axios.post('http://localhost:8080/api/users/login', { Email: this.state.Email, Password: this.state.Password })
    .then(response => {

    
        if (response.data.auth == true) {
          localStorage.setItem('userLog', response.data);
          return response;
        } else {
          throw new Error('não foi possível fazer o login');
        }
      })
      .then(token => {
        localStorage.setItem('auth-token', token);
        browserHistory.push('/admin/dashboard');
        window.location.reload();
      })
      .catch(error => {
        this.setState({ msg: error.message });
      });
  }

  // select email for login
  setUserName(evento) {
    this.setState({ Email: evento.target.value });
  }
  // select password for login
  setPassword(evento) {
    this.setState({ Password: evento.target.value });
  }

  componentDidMount() {
    document.body.classList.toggle("login-page");
  }

  componentWillUnmount() {

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
                      src={require("assets/img/card-danger.png")}
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
                      color="danger"
                      value="login"
                      size="lg"
                    >
                      Get Started
                    </Button>
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
