import React from 'react';
import { Link } from 'react-router-dom';
import settingImage from '../imgs/867443.jpg';
import { isAuthenticated, getUsers, findUser } from '../controllers/UserController';


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

    onSubmitFormSearch = (e) => {
        e.preventDefault();
        let searchText = document.querySelector("#search-friend");
        let uid = isAuthenticated().user._id;
        if(searchText.value.length > 0) {
            findUser(searchText.value, uid)
                .then(users => {
                    this.setState({ users });
                })
        }
    }

    render() {
        let listUsers = this.state.users;

        return (
            <>
                <div className="search">
                    <form onSubmit={this.onSubmitFormSearch} action="#" name="search-friend-form" id="search-friend-form">
                        <input type="text" id="search-friend" placeholder="Search for conservations ..." />
                        <button className="button button-link">
                            <svg style={{ fill: '#2298ff' }} aria-hidden="true" className="svg-icon s-input-icon s-input-icon__search iconSearch" width={16} height={16} viewBox="0 0 18 18"><path d="M18 16.5l-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0z" /></svg>
                        </button>
                    </form>
                </div>
                <div className="discussions" id="scroller">
                    <h1>Chats</h1>
                    <div className="list-group chats" id="chats">
                        {
                            listUsers.map((user, index) => {
                                let username = user.fullname || user.email;
                                return <Link title={username} style={{ order: index + 1 }} id={`dcs_${user._id}`} tabIndex={index} key={index} to={`/chanels/@me/${user._id}`} className="item-discussions single unread">
                                    <img className="avatar-md" src={user.photo || settingImage} alt="avt" />
                                    <div className="status online" />
                                    <div className="data">
                                        <h5>{username}</h5>
                                        <div className="count-unread">
                                            <div className="new bg-red"><span>0</span></div>
                                        </div>

                                        {/* <span>Sun</span>
                                    <p>How can i improve my chances?</p> */}
                                    </div>
                                </Link>
                            })
                        }

                        <div className="scroller" />
                    </div>
                </div>
            </>
        )
    }
}

export default Discussion;
