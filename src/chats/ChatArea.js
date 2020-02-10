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

        this.formData = new FormData();
    }

    async componentDidMount() {
        try {
            window.onload = () => {
                this.scrollToBottom();
            }

            document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);
            let { toUid } = this.props.match.params;
            let uid = this.props.userPayload.user._id;
            let token = this.props.userPayload.token;
            let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
            // get list messages
            this.getMessageIndividualUser(uid, toUid, token)
            // get user that send message to
            let userFriend = await getUserById(toUid);
            this.setState({ userFriend })

            this.handleCreateConnectSocket({ uid, name }, userFriend);
        } catch (e) { console.log(e) }
    }
    componentWillUnmount() {
        console.log("unmount")
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    async componentWillReceiveProps(nextProps) {
        try {
            document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);
            let { toUid } = nextProps.match.params;
            let uid = this.props.userPayload.user._id;
            let token = this.props.userPayload.token;
            // get list messages
            this.setState({ messages: [] });
            this.getMessageIndividualUser(uid, toUid, token)
            // get user that send message to
            let userFriend = await getUserById(toUid);
            this.setState({ userFriend })


        } catch (e) { console.log(e) }
        console.log("receive")
    }

    handleSendMessageFromIndividualUser = () => {
        try {
            window.event.preventDefault();
            let textMessage = document.getElementById("text-message");
            if (textMessage.value.trim() || this.formData.get("photo")) {
                document.querySelector(".preview-image #preview").src = "";
                document.querySelector(".preview-image").classList.remove("on");

                let { toUid } = this.props.match.params;
                let uid = this.props.userPayload.user._id;
                // let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
                let photo = this.props.userPayload.user.photo;
                let token = this.props.userPayload.token;

                // emit event
                this.socket.emit("client-send-message-from-individual-user", { to: toUid, message: textMessage.value, photo, from: uid }, () => {
                    this.setState({ messages: this.state.messages.concat({ isMe: "me", content: textMessage.value }) });
                    document.querySelector(`#dcs_${toUid} p`).innerText = textMessage.value;
                    textMessage.value = "";
                    this.scrollToBottom();
                });


                // save private message to db
                this.formData.append("sender", uid);
                this.formData.append("receiver", toUid);
                this.formData.append("content", textMessage.value);
                postSavePrivateMessage(this.formData, token)
                .then((res) => {
                    console.log(res)
                    this.formData.delete("photo");
                    if (res && res.urlContainImage) {
                        let dataImage = {
                          to: toUid,
                          from: uid,
                          photo,
                          contentPhoto: res.urlContainImage,
                          isMe: "me"
                        }
                        this.setState({
                          messages: this.state.messages.concat(dataImage)
                        });

                        this.socket.emit("client-send-message-contain-image-from-individual-user", dataImage, () => {
                          
                        });
                    }
                })
                .catch(err => console.log(err));
            }

        } catch (e) { console.log(e) }
    }

    handleCreateConnectSocket = (data, userFriend) => {
        try {
            this.socket = socketIOClient(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
            // wait client connect
            this.socket.on('connect', () => {

                this.socket.emit("join-individual", { uid: data.uid, username: data.name }, () => {
                    console.log(`user ${this.props.userPayload.user.email} joined`);
                });

                this.socket.on("server-send-message-from-individual-user", (res) => {
                    if (res.from === userFriend._id) {
                        this.setState({ messages: this.state.messages.concat({ content: res.message, photo: res.photo }) });
                    }
                    document.querySelector(`#dcs_${res.from} p`).innerText = res.message;
                    console.log(`#dcs_${userFriend.uid} .count-unread span`)
                    let currentUnread = Number(document.querySelector(`#dcs_${userFriend._id} .count-unread span`).innerHTML) + 1;
                    console.log("currentUnread", currentUnread);
                    this.showUnReadMessage(currentUnread, res.from);
                });

                this.socket.on("server-send-message-contain-image-from-individual-user", (res) => {
                    if (res.from === userFriend._id) {
                        this.setState({ messages: this.state.messages.concat({ contentPhoto: res.contentPhoto, photo: res.photo }) });
                    }
                    console.log("server-send-message-contain-image-from-individual-user", res.data);
                    document.querySelector(`#dcs_${res.from} p`).innerText = res.message;
                    let currentUnread = Number(document.querySelector(`#dcs_${userFriend._id} .count-unread span`).innerHTML) + 1;
                    this.showUnReadMessage(currentUnread, res.from);
                });
            })
        } catch (e) { console.log(e) }
    }

    getMessageIndividualUser = (senderId, receiverId, token) => {
        getMessageIndividualUser(senderId, receiverId, token)
            .then(res => {
                console.log(res)
                if (!res.message) {
                    let listMessage = [];
                    let countUnreadMessage = 0;
                    res.map(mes => {
                        let objMessage = {};
                        let isMe = mes.sender._id === senderId ? true : false;
                        objMessage.isMe = isMe === true ? "me" : "";
                        objMessage.content = mes.content;
                        objMessage.date = mes.created;
                        objMessage.photo = isMe === true ? mes.receiver.photo : mes.sender.photo;
                        objMessage.contentPhoto = mes.photo;
                        if (mes.sender._id !== senderId && mes.isRead === false) countUnreadMessage += 1;
                        listMessage.push(objMessage);
                    });
                    this.setState({ messages: this.state.messages.concat(listMessage) });
                    this.showUnReadMessage(countUnreadMessage, receiverId);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    showUnReadMessage = (count, toUid) => {
        try {
            if (count > 0) {
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

    previewPhoto = (event) => {
        let reader = new FileReader();
        document.querySelector('.preview-image').classList.add("on");
        let inputAvatar = document.querySelector('.preview-image #preview');
        reader.onload = function () {
            inputAvatar.src = reader.result;
        }
        try {
            reader.readAsDataURL(event.target.files[0]);
            this.formData.append("photo", event.target.files[0]);
        } catch (e) {
            // do nothing
        }
    }
    handlePasteToInput = (event) => {
        try {
            let items = (event.clipboardData || event.originalEvent.clipboardData).items;
            // find pasted image among pasted items
            let blob = null;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    blob = items[i].getAsFile();
                }
            }
            // load image if there is a pasted image
            if (blob !== null) {
                let reader = new FileReader();
                reader.onload = function (event) {
                    document.querySelector('.preview-image').classList.add("on");
                    document.querySelector(".preview-image #preview").src = this.result;
                };
                reader.readAsDataURL(blob);
                this.formData.append("photo", blob);
            }
        } catch (e) { console.log(e) }
    }

    clearFormDataImage = () => {
        document.querySelector('.preview-image').classList.remove("on");
        document.querySelector('.preview-image #preview').src = "";
        this.formData.delete("photo");
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
    scrollToBottom = () => {
        try {
            document.querySelector("#end-of-message").scrollIntoView({ behavior: "smooth" });
        } catch (e) { }
    }

    render() {
        let { userFriend, messages } = this.state;

        let tabActive = document.querySelectorAll(".item-discussions.active");
        Array.from(tabActive).map(el => { el.classList.remove("active") });
        // active tab
        let idTabElement = `dcs_${userFriend._id}`;
        let tabElement = document.getElementById(idTabElement);
        if (tabElement) {
            tabElement.classList.add("active")
        }
        return (
            <Template>
                <div id="chat-area">
                    <div className="top">
                        <div className="inside">
                            <div className="status online" />
                            <div className="data">
                                <h5><a href="/users/">{userFriend.fullname || userFriend.email}</a></h5>
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
                                messages.map((msg, i) => {
                                    return <ItemMessage
                                        key={i}
                                        isMe={msg.isMe}
                                        content={msg.content}
                                        contentPhoto={msg.contentPhoto}
                                        photo={msg.photo}
                                        date={moment(msg.created).fromNow() || "just now"}
                                    />
                                })
                            }
                            {/* <div className="date">
                    <hr />
                    <span>Yesterday</span>
                    <hr />
                  </div>
              */}
                            <div id="end-of-message"></div>
                        </div>
                        <div className="scroller" />
                    </div>
                    <div className="bottom">
                        <form className="text-area">
                            <div id="typing-action">
                                someone is typing ...
              </div>
                            <textarea
                                id="text-message" className="form-control" placeholder="Start typing for reply..." rows={1} defaultValue={""}
                                onPaste={this.handlePasteToInput}
                            />
                            <div className="add-smiles">
                                <span title="add icon" className="em em-blush" />
                            </div>

                            <button onClick={this.handleSendMessageFromIndividualUser} style={{ height: '56x' }} type="submit" className="btn send"><i className="ti-location-arrow" /></button>
                            <label className="label-input input-file">
                                <input
                                    type="file" className="d-none"
                                    onChange={this.previewPhoto}
                                />
                                <i className="ti-clip" />
                            </label>
                        </form>
                    </div>
                    <div onClick={this.clearFormDataImage} className="preview-image">
                        <img id="preview" src="" alt="" />
                    </div>
                </div>
                {/* <div id="call-area">
            </div> */}
            </Template>
        )

    }
}

export default withRouter(ChatArea);