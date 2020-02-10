import React from 'react';
import { withRouter } from 'react-router-dom';
import ItemMessage from '../chats/ItemMessage';
// import ItemMessageAttachment from '../chats/ItemMessageAttachment';
import Template from '../component/TemplateWithNavigation';
import socketIOClient from 'socket.io-client';
import { getUserById } from '../controllers/UserController';
import { getMessageIndividualUser, postSavePrivateMessage } from '../controllers/PrivateChat';
const moment = require("moment");

class ChatArea extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      onlineUser: [],
      userFriend: {}
    }
  }

  async componentDidMount() {
    try {
      document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);
      let { toUid } = this.props.match.params;
      let uid = this.props.userPayload.user._id;
      let token = this.props.userPayload.token;
      let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
      // get list messages
      this.getMessageIndividualUser(uid, toUid, token)
      // get user that send message to
      let userFriend = await getUserById(toUid);
      this.setState({userFriend})

      this.socket = socketIOClient(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
      // wait client connect
      this.socket.on('connect', () => {

        this.socket.emit("join-individual", {uid, username: name}, () => {
          console.log(`user ${this.props.userPayload.user.email} joined`);
        });

        this.socket.on("server-send-message-from-individual-user", (res) => {
          if(res.from === userFriend._id) {
            this.setState( {messages: this.state.messages.concat( {content: res.message, photo: res.photo} )} );
          }
          document.querySelector(`#dcs_${res.from} p`).innerText = res.message;
          let currentUnread = Number(document.querySelector(`#dcs_5d903106288ce027724b7222 .count-unread span`).innerHTML) + 1;
          console.log("currentUnread", currentUnread);
          this.showUnReadMessage(currentUnread, res.from);
        });
      })


    } catch(e) { console.log(e) }
  }

  componentWillUnmount() {
    console.log("unmount")
  }

  handleSendMessageFromIndividualUser = () => {
    try {
      window.event.preventDefault();
      let { toUid } = this.props.match.params;
      let textMessage = document.getElementById("text-message");
      let uid = this.props.userPayload.user._id;
      // let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
      let photo = this.props.userPayload.user.photo;
      let token = this.props.userPayload.token;

      this.socket.emit("client-send-message-from-individual-user", { to: toUid, message: textMessage.value, photo, from: uid }, () => {
        this.setState( {messages: this.state.messages.concat( {isMe: "me", content: textMessage.value} )} );
        document.querySelector(`#dcs_${toUid} p`).innerText = textMessage.value;
        textMessage.value = "";
        document.querySelector("#chat-area .content .container").scrollBy(0, 2000);
      });


      // save private message to db
      postSavePrivateMessage({
        sender: uid,
        receiver: toUid,
        content: textMessage.value
      }, token)
      .then( () => {} )
      .catch( err => console.log(err) );

    } catch (e) { console.log(e) }
  }

  getMessageIndividualUser = (senderId, receiverId, token) => {
    getMessageIndividualUser(senderId, receiverId, token)
    .then( res => {
      console.log(res)
      if(!res.message) {
        let listMessage = [];
        let countUnreadMessage = 0;
        res.map( mes => {
          let objMessage = {};
          let isMe = mes.sender._id === senderId ? true : false;
          objMessage.isMe = isMe === true ? "me" : "";
          objMessage.content = mes.content;
          objMessage.date = mes.created;
          objMessage.photo = isMe === true? mes.receiver.photo : mes.sender.photo;
          if(mes.sender._id !== senderId && mes.isRead === false) countUnreadMessage += 1;
          listMessage.push(objMessage);
        });
        this.setState( {messages: this.state.messages.concat(listMessage) });
        this.showUnReadMessage(countUnreadMessage, receiverId);
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  showUnReadMessage = (count, toUid) => {
    try {
      if(count > 0) {
        document.querySelector(`#dcs_${toUid} .count-unread`).classList.add("on");
        document.querySelector(`#dcs_${toUid} .count-unread span`).innerHTML = count;
      }
    } catch (err) { console.log(err) } 
  }

  showTypingAction = (uTyping) => {
    try {
      document.getElementById("typing-action").classList.add("on");
    } catch (e) { console.log(e) }
  }

  async componentWillReceiveProps(nextProps) {
    try {
      document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);
      let { toUid } = nextProps.match.params;
      let uid = this.props.userPayload.user._id;
      let token = this.props.userPayload.token;
      // get list messages
      this.setState({messages: []});
      this.getMessageIndividualUser(uid, toUid, token)
      // get user that send message to
      let userFriend = await getUserById(toUid);
      this.setState({userFriend})


    } catch(e) { console.log(e) }
    console.log("receive")
  }

  checkUserEnter = (e) => {
    if (e.keyCode === 13) {
      try {
        this.handleSendMessageFromIndividualUser();
      } catch (e) { console.log(e) }
    }
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
    let { userFriend, messages } = this.state;

    let tabActive = document.querySelectorAll(".item-discussions.active");
    Array.from(tabActive).map( el => { el.classList.remove("active") } );
    // active tab
    let idTabElement = `dcs_${userFriend._id}`;
    let tabElement = document.getElementById(idTabElement);
    if(tabElement) {
      tabElement.classList.add("active")
    }
    return (
      <Template>
        <div id="chat-area">
          <div className="top">
            <div className="inside">
              <div className="status online" />
              <div className="data">
                <h5><a href="/users/">{ userFriend.fullname || userFriend.email }</a></h5>
                <span>Active now</span>
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
          <div className="content">
            <div className="container">
              {
                messages.map( (msg, i) => {
                  return <ItemMessage 
                    key={i}
                    isMe={msg.isMe}
                    content={msg.content}
                    date={moment(msg.date).fromNow() || "just now"}
                    photo={msg.photo}
                  />
                })
              }
              {/* <div className="date">
                    <hr />
                    <span>Yesterday</span>
                    <hr />
                  </div>
              */}
              
            </div>
            <div className="scroller" />
          </div>
          <div className="bottom">
            <form className="text-area">
              <div id="typing-action">
                someone is typing ... 
              </div>
              <textarea id="text-message" className="form-control" placeholder="Start typing for reply..." rows={1} defaultValue={""} />
              <div className="add-smiles">
                <span title="add icon" className="em em-blush" />
              </div>
              
              <button onClick={this.handleSendMessageFromIndividualUser} style={{ height: '56x' }} type="submit" className="btn send"><i className="ti-location-arrow" /></button>
            </form>
            <label>
              <input type="file" className="d-none" />
              <span className="btn attach"><i className="ti-clip" /></span>
            </label>
          </div>
        </div>
        {/* <div id="call-area">
            </div> */}
      </Template>
    )

  }
}

export default withRouter(ChatArea);