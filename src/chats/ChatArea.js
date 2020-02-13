import React from 'react';
import _ from 'lodash';
import PeerConnection from '../calls/PeerConnection';
import socketIOClient from 'socket.io-client';
import { withRouter } from 'react-router-dom';
import { getUserById } from '../controllers/UserController';
import { getMessageIndividualUser, postSavePrivateMessage } from '../controllers/PrivateChat';

import ItemMessage from '../chats/ItemMessage';
// import ItemMessageAttachment from '../chats/ItemMessageAttachment';
import Template from '../component/TemplateWithNavigation';
import VideoCallRequest from './VideoCallRequest';
import VideoCallResponse from './VideoCallResponse';

// import socket from "../socket";

const moment = require("moment");

class ChatArea extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            onlineUser: [],
            userFriend: {},

            clientId: '',
            callWindow: '',
            callModal: '',
            callFrom: '',
            localSrc: null,
            peerSrc: null
        }

        this.formData = new FormData();
        this.ORDER_ITEM_DISCUSSION = 0;
        this.LIMIT_MESSAGES = 10;
        this.SKIP_MESSAGES = 0;

        this.pc = {};
        this.config = null;

        this.startCallHandler = this.startCall.bind(this);
        this.endCallHandler = this.endCall.bind(this);
        this.rejectCallHandler = this.rejectCall.bind(this);
    }


    async componentDidMount() {
        try {
            this.toUid = this.props.match.params.toUid;
            window.onload = () => {
                this.scrollToBottom();
                document.querySelector("#chat-area .content .container").addEventListener("scroll", this.onScrollGetMoreMessages);
                // document.getElementById("video-call").addEventListener("click", this.onCallVideoStreaming)
            }

            document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);
            // get list messages
            this.getMessageIndividualUser();

            let uid = this.props.userPayload.user._id;
            let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
            // get user that send message to
            let userFriend = await getUserById(this.toUid);
            this.setState({ userFriend })

            this.handleCreateConnectSocket({ uid, name }, userFriend);
            
        } catch (e) { console.log(e) }
    }

    callWithVideo = (video) => {
        const config = { audio: true, video };
        return () => this.startCall(true, this.toUid, config);
    }

    startCall(isCaller, friendID, config) {
        this.config = config;
        this.pc = new PeerConnection(friendID, this.props.userPayload.user._id)
            .on('localStream', (src) => {
                const newState = { callWindow: 'on', localSrc: src };
                if (!isCaller) newState.callModal = '';
                this.setState(newState);
            })
            .on('peerStream', src => this.setState({ peerSrc: src }))
            .start(isCaller, config);
    }

    rejectCall() {
        const { callFrom } = this.state;
        this.socket.emit('end', { to: callFrom });
        this.setState({ callModal: '' });
    }

    endCall(isStarter) {
        if (_.isFunction(this.pc.stop)) {
            this.pc.stop(isStarter);
        }
        this.pc = {};
        this.config = null;
        this.setState({
            callWindow: '',
            callModal: '',
            localSrc: null,
            peerSrc: null
        });
    }

    componentWillUnmount() {
        console.log("unmount")
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    async componentWillReceiveProps(nextProps) {
        try {
            this.SKIP_MESSAGES = 0;
            this.toUid = nextProps.match.params.toUid;
            document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter);
            // this.orderItemDiscussionToTop(toUid);

            let uid = this.props.userPayload.user._id;
            let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
            // get list messages
            this.setState({ messages: [] });
            this.getMessageIndividualUser();
            // get user that send message to
            let userFriend = await getUserById(this.toUid);
            this.setState({ userFriend });


            this.handleCreateConnectSocket({ uid, name }, userFriend);
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

                this.orderItemDiscussionToTop(this.toUid);

                let uid = this.props.userPayload.user._id;
                // let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
                let photo = this.props.userPayload.user.photo;
                let token = this.props.userPayload.token;

                // emit event
                this.socket.emit("client-send-message-from-individual-user", { to: this.toUid, message: textMessage.value, photo, from: uid }, () => {
                    this.setState({ messages: this.state.messages.concat({ isMe: "me", content: textMessage.value }) });
                    document.querySelector(`#dcs_${this.toUid} p`).innerText = textMessage.value;
                    textMessage.value = "";
                    this.scrollToBottom();
                });


                // save private message to db
                this.formData.append("sender", uid);
                this.formData.append("receiver", this.toUid);
                this.formData.append("content", textMessage.value);
                postSavePrivateMessage(this.formData, token)
                    .then((res) => {
                        console.log(res)
                        this.formData.delete("photo");
                        if (res && res.urlContainImage) {
                            let dataImage = {
                                to: this.toUid,
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
                console.log("socket connected")
                this.socket.emit("join-individual", { uid: data.uid, username: data.name }, () => {
                    console.log(`user ${this.props.userPayload.user.email} joined`);
                });

                this.socket.on("server-send-message-from-individual-user", (res) => {
                    console.log("server-send-message-from-individual-user", res, userFriend._id);
                    if (res.from === userFriend._id) {
                        this.setState({ messages: this.state.messages.concat({ content: res.message, photo: res.photo }) });
                    }
                    this.showNewMessageComming(res.from, res.message, userFriend._id);

                });

                this.socket.on("server-send-message-contain-image-from-individual-user", (res) => {
                    console.log("server-send-message-contain-image-from-individual-user", res, userFriend)
                    if (res.from === userFriend._id) {
                        this.setState({ messages: this.state.messages.concat({ contentPhoto: res.contentPhoto, photo: res.photo }) });
                    }
                    this.showNewMessageComming(res.from, "You have new photo.", userFriend._id);
                });
                
                this.socket
                .on('request', ({ from: callFrom }) => {
                    this.setState({ callModal: 'on', callFrom });
                })
                .on('call', (data) => {
                    if (data.sdp) {
                        console.log("IFFFFFFF", data.sdp)
                        this.pc.setRemoteDescription(data.sdp);
                        if (data.sdp.type === 'offer') {
                            console.log("offer");
                            this.pc.createAnswer();
                        }
                    } else this.pc.addIceCandidate(data.candidate);
                })
                .on('end', this.endCall.bind(this, false))

                
            })
        } catch (e) { console.log(e) }
    }

    showNewMessageComming = (from, message, userFriendId) => {
        try {
            document.querySelector(`#dcs_${from} p`).innerText = message;
            this.orderItemDiscussionToTop(from);
            let currentUnread = Number(document.querySelector(`#dcs_${userFriendId} .count-unread span`).innerHTML) + 1;
            this.showUnReadMessage(currentUnread, from);
        } catch (e) { console.log(e) }
    }

    getMessageIndividualUser = (cb = null) => {
        let token = this.props.userPayload.token;
        let data = {
            senderId: this.props.userPayload.user._id,
            receiverId: this.toUid,
            limit: this.LIMIT_MESSAGES,
            skip: this.SKIP_MESSAGES
        }
        getMessageIndividualUser(data, token)
            .then(res => {
                console.log(res)
                if (res.length > 0) {
                    let listMessage = [];
                    let countUnreadMessage = 0;
                    res.map(mes => {
                        let objMessage = {};
                        let isMe = mes.sender._id === data.senderId ? true : false;
                        objMessage.isMe = isMe === true ? "me" : "";
                        objMessage.content = mes.content;
                        objMessage.date = mes.created;
                        objMessage.photo = isMe === true ? mes.receiver.photo : mes.sender.photo;
                        objMessage.contentPhoto = mes.photo;
                        if (mes.sender._id !== data.senderId && mes.isRead === false) countUnreadMessage += 1;
                        listMessage.push(objMessage);
                    });
                    this.setState({ messages: listMessage.concat(this.state.messages) });
                    this.SKIP_MESSAGES += this.LIMIT_MESSAGES;
                    this.showUnReadMessage(countUnreadMessage, data.receiverId);

                    cb && cb();
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    onScrollGetMoreMessages = () => {
        try {
            let container = document.querySelector("#chat-area .content .container");
            if (container.scrollTop === 0) {
                this.getMessageIndividualUser(() => {
                    setTimeout(this.scrollToTop, 0);
                });
            }
        } catch (err) { console.log(err) }
    }

    scrollToTop = () => {
        try {
            document.querySelector("#start-of-message").scrollIntoView({ behavior: "smooth" });
        } catch (e) { }
    }

    orderItemDiscussionToTop = (toUid) => {
        let el = document.querySelector(`#dcs_${toUid}`);
        console.log(el);
        el.style.order = this.ORDER_ITEM_DISCUSSION;
        this.ORDER_ITEM_DISCUSSION -= 1;
        el.scrollIntoView({ behavior: "smooth" });
    }

    onCallVideoStreaming = () => {
        document.getElementById("end-call-video").addEventListener("click", this.onEndCallVideoStreaming);
        document.getElementById("call").classList.add("on");
        this.socket.emit("call-video-from-individual-user", {
            from: this.props.userPayload.user._id,
            to: this.toUid
        });
    }

    onEndCallVideoStreaming = () => {
        document.getElementById("call").classList.remove("on");
        this.socket.emit("end-call-video-from-individual-user", {
            from: this.props.userPayload.user._id,
            to: this.toUid
        });
    }

    showUnReadMessage = (count, toUid) => {
        try {
            if (count > 0) {
                console.log(`#dcs_${toUid} .count-unread`)
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
        let { userFriend, messages, clientId, callFrom, callModal, callWindow, localSrc, peerSrc } = this.state;

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
                            <button
                                id="video-call" className="btn d-md-block video-call" title="Video call"
                                onClick={this.callWithVideo(true)}
                            >
                                <i className="ti-video-camera" />
                            </button>
                            <button className="btn d-md-block " title="Info">
                                <i className="ti-info" />
                            </button>

                            <div className="dropdown" onClick={this.toggleDropdown}>
                                <button className="btn d-md-block " title="More">
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
                                    if (i === this.LIMIT_MESSAGES - 1) {
                                        return <>
                                            <div id="start-of-message"></div>
                                            <ItemMessage
                                                key={i}
                                                isMe={msg.isMe}
                                                content={msg.content}
                                                contentPhoto={msg.contentPhoto}
                                                photo={msg.photo}
                                                date={moment(msg.date).fromNow() || "just now"}
                                            />
                                        </>
                                    } else {
                                        return <ItemMessage
                                            key={i}
                                            isMe={msg.isMe}
                                            content={msg.content}
                                            contentPhoto={msg.contentPhoto}
                                            photo={msg.photo}
                                            date={moment(msg.date).fromNow() || "just now"}
                                        />
                                    }
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
                {
                    !_.isEmpty(this.config) && (
                        <VideoCallRequest
                            status={callWindow}
                            localSrc={localSrc}
                            peerSrc={peerSrc}
                            config={this.config}
                            mediaDevice={this.pc.mediaDevice}
                            endCall={this.endCallHandler}
                        />
                    )
                }
                {
                    <VideoCallResponse
                        status={callModal}
                        startCall={this.startCallHandler}
                        rejectCall={this.rejectCallHandler}
                        callFrom={callFrom}
                    />
                }
            </Template>
        )

    }
}

export default withRouter(ChatArea);