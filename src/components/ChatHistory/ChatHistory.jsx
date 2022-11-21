import React, { Component } from "react";
import "./ChatHistory.scss";
import Message from "../Message/Message";
import { MDBBtn } from "mdb-react-ui-kit";

class ChatHistory extends Component {
  render() {
    const roomName = this.props.chatRoomName;
    let messages = this.props.chatHistory.filter(
      (msg) => msg.chatRoomId === this.props.chatRoomId
    );
    messages = messages.slice(-50);
    messages = messages.map((msg, k) => <Message key={k} message={msg} />);

    return (
      <div className="ChatHistory">
        <h2>Chat History - {roomName}</h2>
        <div className="d-flex flex-row justify-content-right">
          <MDBBtn
            className="block"
            color="info"
            onClick={this.props.changeRoom}
          >
            Change Room
          </MDBBtn>
        </div>
        {messages}
      </div>
    );
  }
}

export default ChatHistory;
