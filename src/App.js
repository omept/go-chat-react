import React, { Component } from 'react';
import Header from './components/Header/Header';
import ChatHistory from './components/ChatHistory/ChatHistory';
import ChatInput from './components/ChatInput/ChatInput';
import './App.css';
import { websocket } from './api';
import Auth from './components/Auth/Auth';
import Menu from './components/Menu/Menu';

class App extends Component {
  constructor(props) {
    super(props);
    this.defaultValues = this.defaultValues.bind(this)

    this.state = this.defaultValues()

    this.logout = this.logout.bind(this)
    this.handleChatRoomClicked = this.handleChatRoomClicked.bind(this)
    this.onAuthChange = this.onAuthChange.bind(this)
  }

  componentDidMount() {
    // if (this.state.isAuthenticated === false) {

    // } else if (this.state.isAuthenticated === true && this.state.chatRoomId > 0) {

    // } else {
    //   websocket((msg) => {
    //     console.log("New Message")
    //     this.setState(prevState => ({
    //       chatHistory: [...prevState.chatHistory, msg]
    //     }))
    //     console.log(this.state);
    //   });
    // }

  }
  defaultValues() {
    return {
      chatHistory: [],
      isAuthenticated: false,
      jwtToken: false,
      user: {},
      chatRoomId: null,
      chatRoomName: null,
    }
  }
  logout(event) {
    event?.preventDefault()
    this.setState(this.defaultValues())
  }
  send(event) {
    if (event.keyCode === 13) {
      websocket.sendMsg(event.target.value);
      event.target.value = "";
    }
  }

  onAuthChange({ isAuthenticated, jwtToken, user }) {
    this.setState({ isAuthenticated, jwtToken, user })
  }
  handleChatRoomClicked({ Name, ID }) {
    this.setState({ chatRoomName: Name, chatRoomId: ID }, () => {
      console.log(this.state)
    })
  }

  render() {
    let bodyContent
    if (this.state.isAuthenticated === false) {
      bodyContent = <Auth onAuthChange={this.onAuthChange} />
    } else if (this.state.isAuthenticated === true && this.state.chatRoomId === null) {
      bodyContent = <Menu handleChatRoomClicked={this.handleChatRoomClicked} logout={this.logout} jwtToken={this.state.jwtToken} />
    } else {
      bodyContent = (<div>
        <ChatHistory chatHistory={this.state.chatHistory} />
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