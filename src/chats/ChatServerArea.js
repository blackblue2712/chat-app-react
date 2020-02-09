import React from 'react';
import ItemMessage from '../chats/ItemMessage';
// import ItemMessageAttachment from '../chats/ItemMessageAttachment';
import socketIOClient from 'socket.io-client';
import Template from '../component/TemplateWithNavigationForChanel';
import settingImage from '../imgs/867443.jpg';
import "./chatServerArea.css";

import { getSingleChanel, postSaveChanelMessage } from "../controllers/ChanelController";

const moment = require("moment");

class ChatServerArea extends React.Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      onlineUsers: [],
      chanel: {}
    }
  }

  componentDidMount() {
    try {
      // Scroll content message to bottom
      window.onload = () => {
        this.scrollToBottom();
      }
      
      document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter)
      let { chanelId } = this.props.match.params;
      // Get chanel info
      getSingleChanel(chanelId)
        .then(res => {
          if (!res.message) {
            this.setState({
              chanel: res,
              messageList: res.chanelMessages
            });
          }
        });

      // Socket realtime
      this.handleCreateConnectSocket(chanelId);

    } catch (e) { console.log(e) }
  }

  scrollToBottom = () => {
    try {
      document.querySelector("#end-of-message").scrollIntoView({ behavior: "smooth" });
    } catch(e) { }
  }

  handleCreateConnectSocket = (chanelId) => {
    this.socket = socketIOClient(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
    // wait client connect
    this.socket.on('connect', () => {

      let sid = this.socket.id;
      let uid = this.props.userPayload.user._id;
      let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
      let photo = this.props.userPayload.user.photo;

      this.socket.emit("join-chanel", { sid, uid, name, photo, chanelId }, () => {
        console.log("User has join this chanel", chanelId);
      })

      this.socket.on("server-send-message-from-chanel", (res) => {
        console.log("server-send-message-from-chanel", sid, res.data);
        if (uid === res.data.sender._id) res.data.isMe = "me";
        this.setState({ messageList: this.state.messageList.concat(res.data) });
      });
      this.socket.on("list-connected-chanel-users", users => {
        this.setState({ onlineUsers: users })
      })

    });
  }

  handleSendMessageFromChanel = () => {
    try {
      window.event.preventDefault();
      let { chanelId } = this.props.match.params;
      let textMessage = document.getElementById("text-message");

      let uid = this.props.userPayload.user._id;
      let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
      let photo = this.props.userPayload.user.photo;
      let token = this.props.userPayload.token;

      this.socket.emit("client-send-message-from-chanel", { chanelId, content: textMessage.value, sender: { _id: uid, name, photo } }, () => {
        textMessage.value = "";
        document.querySelector("#chat-area .content .container").scrollBy(0, 2000);
      })

      postSaveChanelMessage({ cid: chanelId, uid, content: textMessage.value }, token)
        .then(res => {
          console.log(res)
        })
        .catch(err => { console.log(err) })

    } catch (e) { console.log(e) }
  }

  checkUserEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSendMessageFromChanel();
    }
  }

  componentWillReceiveProps(nextProps) {
    let { chanelId } = nextProps.match.params;
    let sid = this.socket.id;
    let uid = this.props.userPayload.user._id;
    let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
    let photo = this.props.userPayload.user.photo;
    this.socket.emit("join-chanel", { sid, uid, name, photo, chanelId }, () => {
      console.log("User has join this chanel", chanelId);
    })
    getSingleChanel(chanelId)
    .then(res => {
      if (!res.message) {
        this.setState({
          chanel: res,
          messageList: res.chanelMessages
        });
      }
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  toggleDropdown = () => {
    try {
      let drdElement = document.querySelector("#chat-area .list-more");
      if (drdElement.classList.length > 2) {
        drdElement.classList.remove("active");
      } else {
        drdElement.classList.add("active");
        document.getElementById("root").addEventListener("click", () => {
          drdElement.classList.remove("active");
        });
      }
    } catch (e) { }
  }

  render() {
    let { messageList, onlineUsers, chanel } = this.state;
    let uid = this.props.userPayload.user._id;

    let tabActive = document.querySelectorAll(".item-discussions.active");
    Array.from(tabActive).map(el => { el.classList.remove("active") });
    // active tab
    let idTabElement = `dcs_${chanel._id}`;
    let tabElement = document.getElementById(idTabElement);
    if (tabElement) {
      tabElement.classList.add("active")
    }
    return (
      <Template tabPenel="-none" widthRight="100%">
        <div id="chat-area" className="chat-server">
          <div className="top">
            <div className="inside">

              <div className="data">
                <h5><a href="/chanels">{chanel.chanelName}</a></h5>
              </div>
              <button className="btn d-md-block audio-call" title="Audio call">
                <i className="ti-headphone-alt" />
              </button>
              <button className="btn d-md-block audio-call" title="Audio call">
                <i className="ti-video-camera" />
              </button>
              <button className="btn d-md-block audio-call" title="Audio call">
                <i className="ti-info" />
              </button>

              <div className="dropdown" onClick={this.toggleDropdown}>
                <button className="btn d-md-block audio-call" title="Audio call">
                  <i className="ti-gird" />
                </button>

                <div className="dropdown-list list-more">
                  <a href="/" className="voice">Voice Call</a>
                  <a href="/" className="voice">Video Call</a>
                  <hr />
                  <a href="/" className="voice">Clear History</a>
                  <a href="/" className="voice">Block Contact</a>
                  <a href="/" className="voice">Delete Contact</a>
                </div>
              </div>
            </div>
          </div>
          <aside >
            <div>
              <div className="content">
                <div className="container">
                  {
                    messageList.map((item, i) => {
                      return (
                        <ItemMessage
                          key={i}
                          isMe={item.sender._id === uid ? "me" : ""}
                          content={item.content}
                          date={moment(item.created).fromNow() || "just now"}
                          photo={item.sender.photo}
                          name={item.sender.fullname || item.sender.email}
                          uid={item.sender._id}
                        />
                      )
                    })
                  }
                  <div id="end-of-message"></div>
                </div>
                <div className="scroller" />
              </div>
              <div className="bottom">
                <form className="text-area">
                  <textarea
                    id="text-message" className="form-control" placeholder="Start typing for reply..." rows={1} defaultValue={""}

                  />
                  <div className="add-smiles">
                    <span title="add icon" className="em em-blush" />
                  </div>
                  <button onClick={this.handleSendMessageFromChanel} style={{ height: '56x', outline: "none" }} type="submit" className="btn send"><i className="ti-location-arrow" /></button>
                </form>
                <label>
                  <input type="file" className="d-none" />
                  <span className="btn attach"><i className="ti-clip" /></span>
                </label>
              </div>
            </div>
            <div className="container tab-panel">
              <div className="chanel user-online">
                <header>Member online</header>
                {
                  onlineUsers.map((user, i) => {
                    return <a key={i} href="#list-chat" className="item-discussions single">
                      <img className="avatar-md" src={user.photo} alt="avt" />
                      <div className="data">
                        <h5>{user.name}</h5>
                      </div>
                    </a>
                  })
                }
                <a href="#list-chat" className="item-discussions single">
                  <img className="avatar-md" src={settingImage} alt="avt" />
                  <div className="status offline" />
                  <div className="data">
                    <h5>Bob Frank</h5>

                  </div>
                </a>

              </div>
            </div>
          </aside>

        </div>
      </Template>
    )
  }
}

export default ChatServerArea;