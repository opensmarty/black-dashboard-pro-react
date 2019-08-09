import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { browserHistory } from 'react-router';
import axios from "axios";
import { render } from 'react-dom';
import { Link } from 'react-router-dom';

import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

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

export const AUTH_TOKEN = 'auth-token'

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
});

const ADD_TODO = gql`
mutation createNewToken($email: String!, $password: String!) {
  createToken(email: $email, password: $password) {
    token
  }
}
`
class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      msg: ''
    };

    this.setUserName = this.setUserName.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.enviaLogin = this.enviaLogin.bind(this);
  }

  // send form for validation the login
  enviaLogin(evento) {
    this.setState({ msg: '' });
    evento.preventDefault();
    client.mutate({
      mutation: ADD_TODO,
      variables: { email: this.state.email, password: this.state.password },
      optimisticResponse: {},
    }).then(res => {
      localStorage.setItem('auth-token', res.data.createToken.token);
      browserHistory.push('/admin/dashboard');
      window.location.reload();
    }).catch(error => {
      this.setState({ msg: error.message });
    });
  }

  // select email for login
  setUserName(evento) {
    this.setState({ email: evento.target.value });
  }
  // select password for login
  setPassword(evento) {
    this.setState({ password: evento.target.value });
  }

  componentDidMount() {
    document.body.classList.toggle("login-page");
  }

  componentWillUnmount() {

  }

  render() {


    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <>
        <div className="content">
          <Container>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form className="form" onSubmit={this.enviaLogin}>
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
                    <label>{this.state.msg}</label>
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
