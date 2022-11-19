import React, { Component } from "react";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import axios from "axios";
import { baseUrl } from "../../api";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      justifyActive: "tab1",
      submitting: false,
      apiError: false,
      apiErrorMessage: "",
      username: "",
      password: "",
      cpassword: "",
      email: "",
      config: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUserNameChange = this.handleUserNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCPasswordChange = this.handleCPasswordChange.bind(this);
    this.handleAxiosError = this.handleAxiosError.bind(this);
  }

  handleJustifyClick(value) {
    if (value === this.state.justifyActive) {
      return;
    }
    this.setState((prevState) => ({
      justifyActive: value,
    }));
  }

  handleUserNameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleCPasswordChange(event) {
    this.setState({ cpassword: event.target.value });
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  submitSignUp(event) {
    event.preventDefault();
    const s = this.state;
    this.register(s.username, s.email, s.password);
  }

  submitLogin(event) {
    event.preventDefault();
    const s = this.state;
    this.login(s.email, s.password);
  }

  register(username, email, password) {
    this.setState({ submitting: true, apiError: false, apiErrorMessage: "" });
    const apiUrl = `${baseUrl}/v1/api/auth/signup`;
    axios
      .post(
        apiUrl,
        {
          username,
          email,
          password,
        },
        this.state.config
      )
      .then((repos) => {
        const data = repos.data;
        this.props.onAuthChange({
          isAuthenticated: true,
          jwtToken: data.Token,
          user: data.User,
        });
        this.setState({ submitting: false });
      })
      .catch((error) => {
        this.handleAxiosError(error);
      });
  }

  login(email, password) {
    this.setState({ submitting: true, apiError: false, apiErrorMessage: "" });
    const apiUrl = `${baseUrl}/v1/api/auth/login`;
    axios
      .post(
        apiUrl,
        {
          email,
          password,
        },
        this.state.config
      )
      .then((repos) => {
        const data = repos.data;
        this.props.onAuthChange({
          isAuthenticated: true,
          jwtToken: data.Token,
          user: data.User,
        });
        this.setState({ submitting: false });
      })
      .catch((error) => {
        this.handleAxiosError(error);
      });
  }

  handleAxiosError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      this.setState({
        apiError: true,
        apiErrorMessage: error.response.data.Message,
        submitting: false,
      });
    } else if (error.request) {
      this.setState({
        submitting: false,
        apiError: true,
        apiErrorMessage: "the request was made but no response was received",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      this.setState({
        submitting: false,
        apiError: true,
        apiErrorMessage: "Somthing went wrong",
      });
    }
  }

  render() {
    return this.state.submitting ? (
      <MDBContainer className="p-3 my-5 d-flex flex-row justify-content-center w-100">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </MDBContainer>
    ) : (
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
        {this.state.apiError ? (
          <div className="alert alert-danger">{this.state.apiErrorMessage}</div>
        ) : (
          ""
        )}
        <MDBTabs
          pills
          justify
          className="mb-3 d-flex flex-row justify-content-between"
        >
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => this.handleJustifyClick("tab1")}
              active={this.state.justifyActive === "tab1"}
            >
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink
              onClick={() => this.handleJustifyClick("tab2")}
              active={this.state.justifyActive === "tab2"}
            >
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBTabsContent>
          <MDBTabsPane show={this.state.justifyActive === "tab1"}>
            <form onSubmit={this.submitLogin}>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                type="email"
                name="email"
                required={true}
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                type="password"
                name="password"
                required={true}
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />

              <MDBBtn type="submit" className="mb-4 w-100">
                Sign in
              </MDBBtn>
            </form>
          </MDBTabsPane>

          <MDBTabsPane show={this.state.justifyActive === "tab2"}>
            <form onSubmit={this.submitSignUp}>
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                type="text"
                name="username"
                required={true}
                value={this.state.username}
                onChange={this.handleUserNameChange}
              />

              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                type="email"
                name="email"
                required={true}
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                type="password"
                name="password"
                required={true}
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <MDBBtn type="submit" className="mb-4 w-100">
                Sign up
              </MDBBtn>
            </form>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    );
  }
}

export default Auth;
