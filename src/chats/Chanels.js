import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getChanelJoined } from '../controllers/ChanelController';
import { isAuthenticated } from '../controllers/UserController';
import "./Chanels.css";

class Chanels extends React.Component {
    constructor() {
        super();
        this.state = {
            chanels: [],
        }
    }

    componentDidMount() {
        try {
            // Get chanels
            let uid = isAuthenticated().user._id;
            getChanelJoined(uid)
            .then(res => {
                if (!res.message && res.chanels) {
                    this.setState({
                        chanels: res.chanels
                    });
                }
            });
        } catch (e) { console.log(e) }
    }

    render() {
        let { chanels } = this.state;
        return (
            <div className="discussions server-chanels" id="scroller">
                <div className="list-group chats" id="chats">
                    {
                        chanels.map((cn, index) => {
                            return <Link title={cn.chanelName} id={`dcs_${cn.chanelId._id}`} tabIndex={index} key={index} to={`/chanels/${cn.chanelId._id}`} className="item-discussions single unread">
                                <img className="avatar-md" width="48" height="48" src={cn.chanelId.chanelPhoto.photoIcon} alt="chanel-icon" />
                            </Link>
                        })
                    }
                    <Link
                        title="anonymous-chanel" id={`dcs_anonymous`} tabIndex={2} key={2} to="/chanels/anonymous/ha" className="item-discussions single unread"
                    >
                        <img className="avatar-md" src="https://res.cloudinary.com/ddrw0yq95/image/upload/v1581392392/kjadclbvhq0gjnwvihnp.png" alt="avt"/>
                    </Link>
                </div>
            </div>
        )
    }
}

export default withRouter(Chanels);
