import React, { Component } from 'react';
import Header from './components/Header/Header';
import ChatHistory from './components/ChatHistory/ChatHistory';
import ChatInput from './components/ChatInput/ChatInput';
import './App.css';
import { baseUrl, consoleLogger, websocket } from './api';
import Auth from './components/Auth/Auth';
import Menu from './components/Menu/Menu';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.defaultValues = this.defaultValues.bind(this)

    this.state = this.defaultValues()

    this.logout = this.logout.bind(this)
    this.send = this.send.bind(this)
    this.handleChatRoomClicked = this.handleChatRoomClicked.bind(this)
    this.onAuthChange = this.onAuthChange.bind(this)
    this.changeRoom = this.changeRoom.bind(this)
    this.initWebsocket = this.initWebsocket.bind(this)
    this.newMessage = this.newMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.preloadChatHistory = this.preloadChatHistory.bind(this)
  }

  defaultValues() {
    return {
      chatHistory: [],
      isAuthenticated: false,
      jwtToken: "",
      user: {},
      chatRoomId: null,
      chatRoomName: null,
      socket: null,
      chatMessage: "",
    }
  }
  logout(event) {
    event.preventDefault()
    if (this.state.socket != null) {
      this.state.socket.close()
    }
    this.setState(this.defaultValues())
  }

  send(event) {
    let val = event.target.value
    if (val.lenght < 1) {
      return
    }

    if (event.keyCode === 13) {
      this.sendMessage(event.target.value);
      event.target.value = "";
    }
  }

  onAuthChange({ isAuthenticated, jwtToken, user }) {
    this.setState({ isAuthenticated, jwtToken, user }, () => {
      if (isAuthenticated === true) {
        consoleLogger("Logged in, setting up websocket")
        this.initWebsocket()
      }
    })
  }

  changeRoom() {
    this.setState({ chatRoomName: "", chatRoomId: null })
  }

  handleChatRoomClicked({ Name, ID }) {
    this.setState(prev => ({ chatRoomName: Name, chatRoomId: ID, chatHistory: [] }), () => {
      this.preloadChatHistory(ID)
    })
  }

  preloadChatHistory(ID) {
    // fetch list of chat rooms
    const apiUrl = `${baseUrl}/v1/api/chat/room-messages`;
    axios
      .post(apiUrl, { RoomId: ID }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.state.jwtToken}`,
        }
      },)
      .then((repos) => {
        const data = repos.data;
        consoleLogger(data)
        try {
          this.setState(() => ({
            chatHistory: [...data.Chats],
          }));
        } catch (error) {
          consoleLogger(error)
        }

      })
      .catch((error) => {
        this.handleAxiosError(error);
      });
  }

  newMessage(msgEvent) {
    try {
      const data = JSON.parse(msgEvent.data);
      const { chatRoomName, chatRoomId, chatMessage, chatUser } = data.Body
      consoleLogger("new message >> message event data: ", data)
      const nm = { chatRoomName, chatRoomId, chatMessage, chatUser }
      if (chatRoomId !== undefined) {
        this.setState(prev => ({ chatHistory: [...prev.chatHistory, nm] }))
        return
      }
    } catch (error) {
      consoleLogger("error >> newMessage: ", error)
    }

  }

  sendMessage(chatMessage) {
    consoleLogger("sendMessage called")
    const { chatRoomName, chatRoomId, socket } = this.state
    consoleLogger(socket)
    if (socket.readyState === 3) {
      alert("WebSocket is already in CLOSING or CLOSED state.")
      return
    }
    this.state.socket.send(JSON.stringify({ chatRoomName, chatRoomId, chatMessage }))
  }

  initWebsocket() {
    let ss = websocket(this.newMessage, this.state.jwtToken);
    this.setState({ socket: ss })
  }

  render() {
    let bodyContent
    if (this.state.isAuthenticated === false) {
      bodyContent = (<Auth
        onAuthChange={this.onAuthChange} />)
    } else if (this.state.isAuthenticated === true && this.state.chatRoomId === null) {
      bodyContent = <Menu handleChatRoomClicked={this.handleChatRoomClicked} logout={this.logout} jwtToken={this.state.jwtToken} />
    } else {
      bodyContent = (<div>
        <ChatHistory chatHistory={this.state.chatHistory} changeRoom={this.changeRoom} chatRoomName={this.state.chatRoomName} chatRoomId={this.state.chatRoomId} />
        <ChatInput send={this.send} />
      </div>)
    }
    return (
      <div className="App">
        <Header isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
        {bodyContent}
      </div>
    );
  }
}

export default App;