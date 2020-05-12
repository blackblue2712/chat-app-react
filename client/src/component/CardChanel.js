import React from 'react';
import { withRouter } from 'react-router-dom';
import { postJoinChanel } from '../controllers/ChanelController';
import { isAuthenticated } from '../controllers/UserController';

class CardChanel extends React.Component {

    joinChanel = () => {
        let { cid } = this.props;
        let uid = isAuthenticated().user._id;
        let token = isAuthenticated().token;

        postJoinChanel({ cid, uid }, token)
        .then( (res) => {
            if(res.message) {
                this.props.history.push("/chanels/" + cid);
            }
        });
    }
    
    render() {
        let { cardIcon, cardImg, cardDescription, cardTitle, cardMemerCount } = this.props;
        return (
            <div className="guild-card">
                <div className="card-header">
                    <div className="card-img">
                        <img className="card-img" src={cardImg} alt="card-img" />
                    </div>
                    <div className="card-icon">
                        <img className="card-icon" src={cardIcon} alt="icon" />
                    </div>
                    <div className="card-button">
                        <button onClick={this.joinChanel} className="btn">Join</button>
                    </div>
                </div>
                <div className="guild-info">
                    <div className="title">
                        {/* icon */}
                        <span>{cardTitle}</span>
                    </div>
                    <div className="description">
                        <span>{cardDescription}</span>
                    </div>
                    <div className="member-info">
                        <div class="member-count">
                            <div class="dot-online"></div>
                            <strong>{cardMemerCount}</strong> Online
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(CardChanel);