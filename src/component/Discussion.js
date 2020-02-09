import React from 'react';
import { Link } from 'react-router-dom';
import settingImage from '../imgs/867443.jpg';
import { isAuthenticated, getUsers } from '../controllers/UserController';


class Discussion extends React.Component {
    constructor() {
        super();
        this.state = {
            users: [],
        }
    }

    componentDidMount() {
        try {
            let uid = isAuthenticated().user._id;
            getUsers(uid)
            .then(res => {
                this.setState({ users: res });
            })
        } catch (e) { console.log(e) }
    }

    render() {
        let listUsers = this.state.users;
        
        return (
            <div className="discussions" id="scroller">
                <h1>Chats</h1>
                <div className="btn-group add-group">
                    <button className="btn btn-secondary dropdown-toggle">
                        Add +
                  </button>
                </div>
                <div className="list-group chats" id="chats">
                    {
                        listUsers.map((user, index) => {
                            return <Link id={`dcs_${user._id}`} tabIndex={index} key={index} to={`/chanels/@me/${user._id}`} className="item-discussions single unread">
                                <img className="avatar-md" src={user.photo || settingImage} alt="avt" />
                                <div className="status online" />
                                <div className="data">
                                    <h5>{user.fullname || user.email}</h5>
                                    {/* <div className="new bg-red">
                                        <span>9+</span>
                                    </div> */}
                                    <span>Sun</span>
                                    <p>How can i improve my chances?</p>
                                </div>
                            </Link>
                        })
                    }
                    <a href="#list-chat" className="item-discussions single unread">
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

                    <div className="scroller" />
                </div>
            </div>
        )
    }
}

export default Discussion;
