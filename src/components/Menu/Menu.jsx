import React, { Component } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBListGroup,
  MDBListGroupItem,
  MDBInput,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import "./Menu.scss";
import axios from "axios";
import { baseUrl, consoleLogger } from "../../api";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      apiError: false,
      apiErrorMessage: "",
      roomId: "",
      chatRoomName: "",
      chatRooms: [],
      config: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.jwtToken}`,
        },
      },
    };
    this.handleAxiosError = this.handleAxiosError.bind(this);
    this.submitCreateChatRoom = this.submitCreateChatRoom.bind(this);
    this.handleChatRoomNameChange = this.handleChatRoomNameChange.bind(this);
  }
  componentDidMount() {
    // fetch list of chat rooms
    const apiUrl = `${baseUrl}/v1/api/chat/rooms`;
    axios
      .post(apiUrl, {}, this.state.config)
      .then((repos) => {
        const data = repos.data;
        this.setState((prevState) => ({
          submitting: false,
          chatRooms: [...data.ChatRooms],
        }));
      })
      .catch((error) => {
        this.handleAxiosError(error);
      });
  }
  submitCreateChatRoom(event) {
    event.preventDefault();
    this.setState({ submitting: true, apiError: false, apiErrorMessage: "" });
    const { chatRoomName } = this.state;

    const apiUrl = `${baseUrl}/v1/api/chat/create`;
    axios
      .post(
        apiUrl,
        {
          name: chatRoomName,
        },
        this.state.config
      )
      .then((repos) => {
        const data = repos.data;
        this.setState((prevState) => ({
          submitting: false,
          chatRooms: [data.ChatRoom, ...prevState.chatRooms],
        }));
      })
      .catch((error) => {
        this.handleAxiosError(error);
      });
  }
  handleAxiosError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      consoleLogger(error);
      if (error.response.status === 401) {
        this.props.logout();
        alert("Session expired");
        return;
      }
      this.setState({
        apiError: true,
        apiErrorMessage:
          error.response.data.Message ??
          " There was an issue. Try again later.",
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
  handleChatRoomNameChange(event) {
    this.setState({ chatRoomName: event.target.value });
  }

  render() {
    const chatRooms = this.state.chatRooms;
    const listItems = chatRooms.map((entry) => (
      <MDBListGroupItem
        key={entry.ID}
        onClick={() => this.props.handleChatRoomClicked(entry)}
      >
        {entry.Name}
      </MDBListGroupItem>
    ));
    return this.state.submitting ? (
      <MDBContainer className="p-3 my-5 d-flex flex-row justify-content-center w-100">
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </MDBContainer>
    ) : (
      <MDBContainer className="text-center mt-3  ">
        <MDBRow>
          {this.state.apiError === true ? (
            <div className="alert alert-danger">
              {this.state.apiErrorMessage}
            </div>
          ) : (
            ""
          )}
          <MDBCol className="chat-room-list " size="md">
            <h3> Select Chat Room ({chatRooms.length})</h3>
            {chatRooms.length === 0 ? (
              <div className="alert alert-danger">No chat rooms available</div>
            ) : (
              <MDBListGroup
                className="d-flex flex-column justify-content-center cursor-pointer"
                style={{ minWidthL: "22rem" }}
                light
              >
                {listItems}
              </MDBListGroup>
            )}
          </MDBCol>
          <MDBCol size="md">
            <h3>Create New Chat Room</h3>
            <form
              className="chat-room-list d-flex flex-column justify-content-center"
              onSubmit={this.submitCreateChatRoom}
            >
              <MDBInput
                wrapperClass="mb-4"
                label="Chat Room Name"
                type="text"
                name="name"
                required={true}
                value={this.state.chatRoomName}
                onChange={this.handleChatRoomNameChange}
              />

              <MDBBtn type="submit" className="mb-4 w-100">
                Create
              </MDBBtn>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Menu;
