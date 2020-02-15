import React from 'react';
import ItemMessage from '../chats/ItemMessage';
import socketIOClient from 'socket.io-client';
import Template from '../component/TemplateWithNavigationForChanel';
import "./chatServerArea.css";

import { getSingleChanel, getChanelMessages, postSaveChanelMessage } from "../controllers/ChanelController";

const moment = require("moment");

class ChatServerArea extends React.Component {
    constructor() {
        super();
        this.state = {
            messageList: [],
            onlineUsers: [],
            chanel: {}
        }

        this.formData = new FormData();
        this.LIMIT_MESSAGES = 10;
        this.SKIP_MESSAGES = 0;
    }

    componentDidMount() {
        try {
            this.chanelId = this.props.match.params.chanelId;
            // Scroll content message to bottom
            window.onload = () => {
                this.scrollToBottom();
                document.querySelector("#chat-area .content .container").addEventListener("scroll", this.onScrollGetMoreMessages);
            }

            document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter)
            // Get chanel info
            this.getSingleChanel();
            this.getChanelMessages(() => { });

            // Socket realtime
            this.handleCreateConnectSocket();

        } catch (e) { console.log(e) }
    }

    componentWillReceiveProps(nextProps) {
        this.chanelId = nextProps.match.params.chanelId;
        this.SKIP_MESSAGES = 0;
        let sid = this.socket.id;
        let uid = this.props.userPayload.user._id;
        let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
        let photo = this.props.userPayload.user.photo;
        this.socket.emit("join-chanel", { sid, uid, name, photo, chanelId: this.chanelId }, () => {
            console.log("User has join this chanel", this.chanelId);
        })
        this.setState({ messageList: [] });
        this.getSingleChanel();
        this.getChanelMessages(() => { });
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    getSingleChanel = () => {
        getSingleChanel(this.chanelId)
            .then(res => {
                if (!res.message) {
                    this.setState({
                        chanel: res,
                    });
                }
            });
    }

    getChanelMessages = (cb) => {
        let token = this.props.userPayload.token;

        getChanelMessages({ cid: this.chanelId, limit: this.LIMIT_MESSAGES, skip: this.SKIP_MESSAGES }, token)
            .then(res => {
                console.log("getChanelMessages", res);
                if (res.length > 0) {
                    this.setState({ messageList: res.concat(this.state.messageList) });
                    cb();
                    this.SKIP_MESSAGES += this.LIMIT_MESSAGES;
                }
            })
            .catch(err => console.log(err));

    }

    onScrollGetMoreMessages = (event) => {
        try {
            let container = document.querySelector("#chat-area .content .container");
            if (container.scrollTop === 0) {
                this.getChanelMessages(() => {
                    setTimeout(this.scrollToTop, 0);
                });
            }
        } catch (err) { console.log(err) }
    }

    scrollToBottom = () => {
        try {
            document.querySelector("#end-of-message").scrollIntoView({ behavior: "smooth" });
        } catch (e) { }
    }

    scrollToTop = () => {
        try {
            document.querySelector("#start-of-message").scrollIntoView({ behavior: "smooth" });
        } catch (e) { }
    }

    handleCreateConnectSocket = () => {
        this.socket = socketIOClient(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
        // wait client connect
        this.socket.on('connect', () => {

            let sid = this.socket.id;
            let uid = this.props.userPayload.user._id;
            let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
            let photo = this.props.userPayload.user.photo;

            this.socket.emit("join-chanel", { sid, uid, name, photo, chanelId: this.chanelId }, () => {
                console.log(name + " has join this chanel", this.chanelId);
            })

            this.socket.on("server-send-message-from-chanel", (res) => {
                // console.log("server-send-message-from-chanel", sid, res.data);
                if (uid === res.data.sender._id) res.data.isMe = "me";
                this.setState({ messageList: this.state.messageList.concat(res.data) });
            });
            this.socket.on("server-send-message-contain-image-from-chanel", (res) => {
                console.log("server-send-message-contain-image-from-chanel", sid, res.data);
                if (uid !== res.data.sender._id) {
                    this.setState({ messageList: this.state.messageList.concat(res.data) });
                }
            });

            this.socket.on("list-connected-chanel-users", users => {
                this.setState({ onlineUsers: users })
            });

        });
    }

    handleSendMessageFromChanel = () => {
        try {
            window.event.preventDefault();
            let { chanelId } = this.props.match.params;
            let textMessage = document.getElementById("text-message");
            if (textMessage.value.trim() || this.formData.get("photo")) {
                document.querySelector(".preview-image #preview").src = "";
                document.querySelector(".preview-image").classList.remove("on");

                let uid = this.props.userPayload.user._id;
                let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
                let photo = this.props.userPayload.user.photo;
                let token = this.props.userPayload.token;

                // emit event
                let data = {};
                data.sender = {};
                data.chanelId = chanelId;
                data.content = textMessage.value;
                data.sender._id = uid;
                data.sender.photo = photo;
                data.sender.name = name;

                this.socket.emit("client-send-message-from-chanel", data, () => {
                    textMessage.value = "";
                    document.querySelector("#chat-area .content .container").scrollBy(0, 2000);
                })


                this.formData.append("cid", chanelId);
                this.formData.append("uid", uid);
                this.formData.append("content", textMessage.value);
                postSaveChanelMessage(this.formData, token)
                    .then(res => {
                        console.log(res);
                        this.formData.delete("photo");
                        if (res && res.urlContainImage) {
                            let dataImage = {
                                sender: {
                                    _id: uid,
                                    name,
                                    photo: photo
                                },
                                photo: res.urlContainImage,
                            }
                            this.setState({
                                messageList: this.state.messageList.concat(dataImage)
                            });

                            dataImage.chanelId = chanelId;
                            this.socket.emit("client-send-message-contain-image-from-chanel", dataImage, () => {
                                console.log("Server-send-message-contain-image-from-chanel");
                            })
                        }
                    })
                    .catch(err => { console.log(err) })
            }


        } catch (e) { console.log(e) }
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

    checkUserEnter = (e) => {
        if (e.keyCode === 13) {
            this.handleSendMessageFromChanel();
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
        let { messageList, onlineUsers, chanel } = this.state;
        let uid = this.props.userPayload.user._id;

        let tabActive = document.querySelectorAll(".item-discussions.active");
        Array.from(tabActive).map(el => { el.classList.remove("active") });
        // active tab
        let idTabElement = `dcs_${this.chanelId}`;
        let tabElement = document.getElementById(idTabElement);
        if (tabElement) {
            tabElement.classList.add("active")
        }

        return (
            <Template tabPenel="-none" widthRight="calc(100% - 80px)">
                <div id="video-player"></div>
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
                                            if (i === this.LIMIT_MESSAGES - 1) {
                                                return <>
                                                    <div id="start-of-message"></div>
                                                    <ItemMessage
                                                        key={i}
                                                        isMe={item.sender._id === uid ? "me" : ""}
                                                        content={item.content}
                                                        contentPhoto={item.photo}
                                                        photo={item.sender.photo}
                                                        date={moment(item.created).fromNow() || "just now"}
                                                        name={item.sender.fullname || item.sender.email}
                                                        uid={item.sender._id}
                                                    />
                                                </>
                                            }
                                            return (
                                                <ItemMessage
                                                    key={i}
                                                    isMe={item.sender._id === uid ? "me" : ""}
                                                    content={item.content}
                                                    contentPhoto={item.photo}
                                                    photo={item.sender.photo}
                                                    date={moment(item.created).fromNow() || "just now"}
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
                                        onPaste={this.handlePasteToInput}
                                    />
                                    <div className="add-smiles">
                                        <span title="add icon" className="em em-blush" />
                                    </div>
                                    <button onClick={this.handleSendMessageFromChanel} style={{ height: '56x', outline: "none" }} type="submit" className="btn send"><i className="ti-location-arrow" /></button>
                                    <label className="label-input input-file">
                                        <input
                                            type="file" className="d-none"
                                            accept="image/*"
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
                                    <img className="avatar-md" src="https://res.cloudinary.com/ddrw0yq95/image/upload/v1581392392/kjadclbvhq0gjnwvihnp.png" alt="avt" />
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