import React from 'react';
import ItemMessage from '../chats/ItemMessage';
import YouTubePlayer from 'youtube-player';
import YoutubePlay from "./YoutubePlay";
import socketIOClient from 'socket.io-client';
import Template from '../component/TemplateWithNavigationForChanel';
import "./chatServerArea.css";

const moment = require("moment");

class ChatAnonymous extends React.Component {
    constructor() {
        super();
        this.state = {
            onlineUsers: [],
            messageList: []
        }
        this.CHANEL_AN = "anonymous";
        this.formData = new FormData();
        this.onPlayQueue = [];
        this.onPlaying = false;
    }

    componentDidMount() {
        try {
            this.playerFactory = YouTubePlayer('video-player');
            this.player = new YoutubePlay(this.playerFactory);

            document.getElementById("text-message").addEventListener("keyup", this.checkUserEnter)
            // Socket realtime
            this.handleCreateConnectSocket();

        } catch (e) { console.log(e) }
    }

    componentWillReceiveProps(nextProps) {
        let sid = this.socket.id;
        let uid = this.props.userPayload.user._id;
        let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;
        this.socket.emit("join-chanel", { sid, uid, name, chanelId: this.CHANEL_AN }, () => {
            console.log("User has join this chanel", this.CHANEL_AN);
        })
        this.setState({ messageList: [] });
    }

    scrollToBottom = () => {
        try {
            document.querySelector("#end-of-message").scrollIntoView({ behavior: "smooth" });
        } catch (e) { }
    }

    handleCreateConnectSocket = () => {
        this.socket = socketIOClient(process.env.REACT_APP_API_URL, { transports: ['websocket'] });
        // wait client connect
        this.socket.on('connect', () => {

            let sid = this.socket.id;
            let uid = this.props.userPayload.user._id;
            let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;

            this.socket.emit("join-chanel", { sid, uid, name, chanelId: this.CHANEL_AN }, () => {
                console.log( name + " has join this chanel", this.CHANEL_AN);
            })

            this.socket.on("server-send-message-from-chanel", (res) => {
                // console.log("server-send-message-from-chanel", sid, res.data);
                res.data.sender.photo = "https://res.cloudinary.com/ddrw0yq95/image/upload/v1581392392/kjadclbvhq0gjnwvihnp.png";
                
                if (uid === res.data.sender._id) {
                    res.data.isMe = "me";
                } else {
                    if (res.data.content.indexOf(">p") !== -1) {   
                        this.player.searchYoutube(res.data.content);
                    }
                }
                this.setState({ messageList: this.state.messageList.concat(res.data) });
            });
            this.socket.on("server-send-message-contain-image-from-chanel", (res) => {
                console.log("server-send-message-contain-image-from-chanel", sid, res.data);
                if (res.data.content.indexOf(">p") !== -1) {   
                    this.player.searchYoutube(res.data.content);
                }
                if (uid !== res.data.sender._id) {
                    this.setState({ messageList: this.state.messageList.concat(res.data) });
                }
            });

            this.socket.on("list-connected-chanel-users", users => {
                this.setState({ onlineUsers: users })
            });
            this.socket.on("play-music", data => {
                let isPlaying = this.player.getIsPlaying();
                if(isPlaying) {
                    this.player.getCurrentTime().then( time => {
                        let playQueue = this.player.getPlayQueue();
                        let playQueueName = this.player.getPlayQueueName();
                        let currentSong = this.player.getCurrentSong();
                        console.log(time, playQueue, currentSong);
                        this.socket.emit("play-music", { time, playQueue, playQueueName, currentSong, chanelId: this.CHANEL_AN });
                    })
                }
            });
            this.socket.on("bot-send-queue", data => {
                console.log(data);
                this.player = new YoutubePlay(this.playerFactory, Number(data.time) + 3);
                this.player.playVideo(data.currentSong);
                this.player.concatQueue(data.playQueue, data.playQueueName)
            });
            this.socket.on("skip-music", () => {
                console.log("skip-muisc");
                this.player.skipVideo();
            });

        });
    }

    handleSendMessageFromChanel = () => {
        try {
            window.event.preventDefault();
            let textMessage = document.getElementById("text-message");
            if (textMessage.value.trim() || this.formData.get("photo")) {
                document.querySelector(".preview-image #preview").src = "";
                document.querySelector(".preview-image").classList.remove("on");

                let uid = this.props.userPayload.user._id;
                let name = this.props.userPayload.user.fullname || this.props.userPayload.user.email;

                // emit event
                let data = {};
                data.sender = {};
                data.chanelId = this.CHANEL_AN;
                data.content = textMessage.value;
                data.sender._id = uid;
                data.sender.name = name;

                this.socket.emit("client-send-message-from-chanel", data, () => {
                    textMessage.value = "";
                    document.querySelector("#chat-area .content .container").scrollBy(0, 2000);
                })


                
                if (data.content.indexOf(">p") !== -1) {   
                    this.player.searchYoutube(data.content);
                }
                if(data.content.indexOf(">q") !== -1) {
                    let qn = this.player.getPlayQueueName();
                    console.log(qn)
                    if(qn.length > 0) {
                        let queue = []
                        qn.map ( q => {
                            queue.push({ content: q, sender: {} });
                        });

                        this.setState( (state) => {
                            return { messageList: state.messageList.concat(queue) }
                        })
                    } else {
                        this.setState( (state) => {
                            return { messageList: state.messageList.concat({ content: "Queue is empty. Use command >p to add queue.", sender: {} }) }
                        })
                    }
                }
                if (data.content.indexOf(">s") !== -1) {   
                    this.socket.emit("skip-music", this.CHANEL_AN);
                }
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
        let { messageList, onlineUsers } = this.state;
        let uid = this.props.userPayload.user._id;

        let tabActive = document.querySelectorAll(".item-discussions.active");
        Array.from(tabActive).map(el => { el.classList.remove("active") });
        // active tab
        let idTabElement = `dcs_${this.CHANEL_AN}`;
        let tabElement = document.getElementById(idTabElement);
        if (tabElement) {
            tabElement.classList.add("active")
        }

        return (
            <Template tabPenel="-none" widthRight="calc(100% - 80px)">
                <div id="video-player">
                    
                </div>
                <div id="chat-area" className="chat-server">
                    <div className="top">
                        <div className="inside">

                            <div className="data">
                                <h5><a href="/chanels">Anonymous</a></h5>
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
                                            <img className="avatar-md" src="https://res.cloudinary.com/ddrw0yq95/image/upload/v1581392392/kjadclbvhq0gjnwvihnp.png" alt="avt" />
                                            <div className="data">
                                                <h5>Guest</h5>
                                            </div>
                                        </a>
                                    })
                                }

                            </div>
                        </div>
                    </aside>

                </div>
            </Template>
        )
    }
}

export default ChatAnonymous;