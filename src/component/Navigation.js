import React from 'react';
import { Link, withRouter } from "react-router-dom";
import  { getSignout } from '../controllers/UserController';
import CreateChanel from './CreateChanel';
import "./Navigation.css";

class Navigation extends React.Component {
    constructor() {
        super();
        this.state = {
            
        }
    }

    sigoutAccount = () => {
        window.event.preventDefault();
        getSignout()
        .then( (res) => {
            localStorage.removeItem("jwt");
            this.props.history.push("/auth");
        })
    }
    
    openModalCreateChanel = () => {
        try {
            let modal = document.querySelector(".layout-modal");
            modal.classList.add("active");
        } catch(e) { console.log(e) }
    }

    

    render() {
        return (
            <div className="navigation">
                <div className="container">
                    <div className="inside">
                        <div className="nav nav-tab menu">
                            <a href="#settings" data-toggle="tab" title="User Setting" className="">
                                <i className="ti-panel"></i>
                                Setting
                            </a>
                            <a href="#members" data-toggle="tab" title="All members" className="active show">
                                <i className="ti-home active"></i>
                                All Friends
                            </a>
                            <Link to="/" data-toggle="tab" className="" title="Chat">
                                <i className="ti-comment-alt"></i>
                                Recent Chat
                            </Link>
                            <a href="#notifications" data-toggle="tab" className="f-grow1" title="Notifications">
                                <i className="ti-bell"></i>
                                Notifications
                            </a>
                            <Link to="/discovery" data-toggle="tab" className="f-grow1" title="Notifications">
                                <svg name="Search" aria-hidden="false" width="30" height="30" viewBox="0 0 18 18"><g fill="none" aria-hidden="true"><path fill="currentColor" d="M3.60091481,7.20297313 C3.60091481,5.20983419 5.20983419,3.60091481 7.20297313,3.60091481 C9.19611206,3.60091481 10.8050314,5.20983419 10.8050314,7.20297313 C10.8050314,9.19611206 9.19611206,10.8050314 7.20297313,10.8050314 C5.20983419,10.8050314 3.60091481,9.19611206 3.60091481,7.20297313 Z M12.0057176,10.8050314 L11.3733562,10.8050314 L11.1492281,10.5889079 C11.9336764,9.67638651 12.4059463,8.49170955 12.4059463,7.20297313 C12.4059463,4.32933105 10.0766152,2 7.20297313,2 C4.32933105,2 2,4.32933105 2,7.20297313 C2,10.0766152 4.32933105,12.4059463 7.20297313,12.4059463 C8.49170955,12.4059463 9.67638651,11.9336764 10.5889079,11.1492281 L10.8050314,11.3733562 L10.8050314,12.0057176 L14.8073185,16 L16,14.8073185 L12.2102538,11.0099776 L12.0057176,10.8050314 Z"></path></g></svg>
                                Discovery
                            </Link>
                            <Link onClick={this.openModalCreateChanel} to="#add-chanel" data-toggle="tab" className="f-grow1" title="Notifications">
                                <svg name="Nova_Add" className="circleIcon add-chanel" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 11.001H13V3.00098H11V11.001H3V13.001H11V21.001H13V13.001H21V11.001Z"></path></svg>
                            </Link>                            
                            <Link onClick={this.sigoutAccount} to="#sign-out" className="btn power" title="Sign Out"><i className="ti-power-off"></i></Link>

                            
                        </div>
                    </div>
                </div>
                <CreateChanel />
            </div>
        )
    }
}

export default withRouter(Navigation);