import React from 'react';
import { withRouter } from 'react-router-dom';
import ItemMessage from '../chats/ItemMessage';
// import ItemMessageAttachment from '../chats/ItemMessageAttachment';
import Template from '../component/TemplateWithNavigation';
import socketIOClient from 'socket.io-client';
import { getUserById } from '../controllers/UserController';

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
      

      // get user that send message to
      let userFriend = await getUserById(toUid);
      this.setState({userFriend})

      this.socket = socketIOClient(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
      // wait client connect
      this.socket.on('connect', () => {
        let uid = this.props.userPayload.user._id;
        let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;

        this.socket.emit("join-individual", {uid, username: name}, () => {
          console.log(`user ${this.props.userPayload.user.email} joined`);
        });

        this.socket.on("server-send-message-from-individual-user", (res) => {
          if(res.from === userFriend._id) {
            this.setState( {messages: this.state.messages.concat( {content: res.message, photo: res.photo} )} );
          }
          document.querySelector(`#dcs_${res.from} p`).innerText = res.message;
        });
      })


    } catch(e) { console.log(e) }
  }

  handleSendMessageFromIndividualUser = () => {
    try {
      window.event.preventDefault();
      let { toUid } = this.props.match.params;
      let textMessage = document.getElementById("text-message");
      let uid = this.props.userPayload.user._id;
      // let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
      let photo = this.props.userPayload.user.photo;

      this.socket.emit("client-send-message-from-individual-user", { to: toUid, message: textMessage.value, photo, from: uid }, () => {
        this.setState( {messages: this.state.messages.concat( {isMe: "me", content: textMessage.value} )} );
        textMessage.value = "";
        document.querySelector("#chat-area .content .container").scrollBy(0, 2000);
      })


    } catch (e) { console.log(e) }
  }

  async componentWillReceiveProps(nextProps) {
    try {
      document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);

      // get user that send message to
      let { toUid } = nextProps.match.params;
      let userFriend = await getUserById(toUid);
      this.setState({userFriend})


    } catch(e) { console.log(e) }
    console.log("receive")
  }

  checkUserEnter = (e) => {
    if (e.keyCode === 13) {
      try {
        window.event.preventDefault();
        let { toUid } = this.props.match.params;
        let textMessage = document.getElementById("text-message");
        let uid = this.props.userPayload.user._id;
        let photo = this.props.userPayload.user.photo;

        this.socket.emit("client-send-message-from-individual-user", { to: toUid, message: textMessage.value, photo, from: uid }, () => {
          this.setState( {messages: this.state.messages.concat( {isMe: "me", content: textMessage.value} )} );
          textMessage.value = "";
          document.querySelector("#chat-area .content .container").scrollBy(0, 2000);
        });
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
                    date="11:32 AM"
                    photo={msg.photo}
                  />
                })
              }
              {/* <div className="date">
                    <hr />
                    <span>Yesterday</span>
                    <hr />
                  </div>
                  <ItemMessage 
                    isMe=""
                    content="Where was i, i worry about my viewrs missing me too much!"
                    date="09:46 AM"
                  />
                  <ItemMessage 
                    isMe="me"
                    content="But if you are not available to talk, then would't they miss you more?"
                    date="11:32 AM"
                  />

                  <ItemMessage 
                    isMe=""
                    content="Aren't you sweet."
                    date="02:56 PM"
                  />

                  <ItemMessage 
                    isMe="me"
                    content="That's not an answer.."
                    date=""
                  />

                  <ItemMessage 
                    isMe="me"
                    content="I am tres sorry, what were you saying?"
                    date="10:21 PM"
                  />

                  <ItemMessage 
                    isMe=""
                    content="Great start guys, why can you only talk at certain time on certain days?"
                    date="11:07 PM"
                  />
                  <ItemMessage 
                    isMe="me"
                    content="hmmmm, Well done all. send me document please"
                    date="10:21 PM"
                  />
                 
                  <ItemMessageAttachment 
                    isMe=""
                    content="I am tres sorry, what were you saying?"
                    date="11:07 PM"
                    filename="Policy Sheet.pdf"
                    capacitty="80kb Document"
                  />

                  <ItemMessage 
                    isMe="me"
                    content="i have received the .pdf document please send me jpeg file for our requirement.."
                    date="10:21 PM"
                  />
                  
                  <div className="date">
                    <hr />
                    <span>Today</span>
                    <hr />
                  </div> */}

            </div>
            <div className="scroller" />
          </div>
          <div className="bottom">
            <form className="text-area">
              <textarea id="text-message" className="form-control" placeholder="Start typing for reply..." rows={1} defaultValue={""} />
              <div className="add-smiles">
                <span title="add icon" className="em em-blush" />
              </div>
              <div className="smiles-bunch">
                <i className="em em---1" />
                <i className="em em-smiley" />
                <i className="em em-anguished" />
                <i className="em em-laughing" />
                <i className="em em-angry" />
                <i className="em em-astonished" />
                <i className="em em-blush" />
                <i className="em em-disappointed" />
                <i className="em em-worried" />
                <i className="em em-kissing_heart" />
                <i className="em em-rage" />
                <i className="em em-stuck_out_tongue" />
                <i className="em em-expressionless" />
                <i className="em em-bikini" />
                <i className="em em-christmas_tree" />
                <i className="em em-facepunch" />
                <i className="em em-pushpin" />
                <i className="em em-tada" />
                <i className="em em-us" />
                <i className="em em-rose" />
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