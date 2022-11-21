import React, { Component } from "react";
import "./Message.scss";

class Message extends Component {
  constructor(props) {
    super(props);
    const { chatRoomName, chatRoomId, chatMessage, chatUser } =
      this.props.message;
    this.state = {
      chatMessage,
      chatRoomId,
      chatRoomName,
      chatUser,
    };
  }

  render() {
    return (
      <div className="Message">
        <span className="text-decoration-underline">
          {this.state.chatUser ?? "username"}
        </span>{" "}
        : {this.state.chatMessage}
      </div>
    );
  }
}

export default Message;
