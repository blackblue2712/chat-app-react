import React from 'react';
import settingImage from '../imgs/867443.jpg';

class Discussion extends React.Component {

    render() {
        return (
            <div className="discussions" id="scroller">
                <h1>Chats</h1>
                <div className="btn-group add-group">
                    <button className="btn btn-secondary dropdown-toggle">
                        Add +
                  </button>
                </div>
                <div className="list-group chats" id="chats">
                    <a href="#list-chat" className="item-discussions single active unread">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status online" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single unread">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status away" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <a href="#list-chat" className="item-discussions single">
                        <img className="avatar-md" src={settingImage} alt="avt" />
                        <div className="status offline" />
                        <div className="data">
                            <h5>Bob Frank</h5>
                            <div className="new bg-red">
                                <span>9+</span>
                            </div>
                            <span>Sun</span>
                            <p>How can i improve my chances?</p>
                        </div>
                    </a>
                    <div className="scroller" />
                </div>
            </div>
        )
    }
}

export default Discussion;
