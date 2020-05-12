import React from 'react';
import settingImage from '../imgs/867443.jpg';
import Logo from '../imgs/logo.png';
import { isAuthenticated } from '../controllers/UserController';

class TabPanel extends React.Component {

    showNavigation = () => {
        // this.setState()

        let nav = document.querySelector("#wrap-left .navigation") || {};
        if (nav.classList.length > 1) {
            document.getElementById("wrap-right").style.width = "calc(100% - 369px)";
            nav.classList.remove("active");
        } else {
            nav.classList.add("active");
            document.getElementById("wrap-right").style.width = "calc(100% - 370px - 95px)";
        }
    }

    render() {
        let userImage = isAuthenticated().user.photo;
        let display = this.props.display;
        return (
            <div className={`container tab-panel ${display}`}>
                <div className="panel">
                    <div className="setting" onClick={this.showNavigation}>
                        <img className="border-radius-50" width={45} height={45} src={userImage || settingImage} alt="img-setting" />
                    </div>
                    <div className="logo">
                        <img src={Logo} alt="brand-logo" />
                    </div>
                    {this.props.children}

                </div>
            </div>
        )
    }
}

export default TabPanel;