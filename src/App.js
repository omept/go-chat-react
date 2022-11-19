import React, { Component } from 'react';
import Header from './components/Header/Header';
import ChatHistory from './components/ChatHistory/ChatHistory';
import ChatInput from './components/ChatInput/ChatInput';
import './App.css';
import { websocket } from './api';
import Auth from './components/Auth/Auth';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory: [],
      isAuthenticated: false,
      jwtToken: false,
      user: {},
      chatRoomId: null,
    }

    this.logout = this.logout.bind(this)
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
  logout(event) {
    event.preventDefault()
    this.setState({ isAuthenticated: false, jwtToken: "", user: {} })
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

  render() {
    let bodyContent
    if (this.state.isAuthenticated === false) {
      bodyContent = <Auth onAuthChange={this.onAuthChange} />
    } else if (this.state.isAuthenticated === true && this.state.chatRoomId === null) {
      bodyContent = <div> New Chat or Select Chat</div>
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