import React from 'react';
import settingImage from '../imgs/867443.jpg';
import Logo from '../imgs/logo.png';

import Discussion from './Discussion';

class TabPanel extends React.Component {
    showNavigation = () => {
        // this.setState()

        let nav = document.querySelector("#wrap-left .navigation") || {};
        if (nav.classList.length > 1) {
            document.getElementById("wrap-right").style.width = "calc(100% - 370px)";
            nav.classList.remove("active");
        } else {
            nav.classList.add("active");
            document.getElementById("wrap-right").style.width = "calc(100% - 370px - 95px)";
        }
    }

    render() {
        return (
            <div className="container tab-panel">
                <div className="panel">
                    <div className="setting" onClick={this.showNavigation}>
                        <img className="border-radius-50" width={45} height={45} src={settingImage} alt="img-setting" />
                    </div>
                    <div className="logo">
                        <img src={Logo} alt="brand-logo" />
                    </div>
                    <div className="search">
                        <form action="#" name="search-friend-form" id="search-friend-form">
                            <input type="text" id="search-friend" placeholder="Search for conservations ..." />
                            <button className="button button-link">
                                <svg style={{ fill: '#2298ff' }} aria-hidden="true" className="svg-icon s-input-icon s-input-icon__search iconSearch" width={16} height={16} viewBox="0 0 18 18"><path d="M18 16.5l-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0z" /></svg>
                            </button>
                        </form>
                    </div>
                    <div className="list-group filter">
                        <button className="btn filterMembersBtn active" data-filter="all">
                            All
                </button>
                        <button className="btn filterMembersBtn" data-filter="favourites">
                            Favourites
                </button>
                        <button className="btn filterMembersBtn" data-filter="unread">
                            Unread
                </button>
                    </div>

                    {/* DISCUSSION */}
                    <Discussion />

                </div>
            </div>
        )
    }
}

export default TabPanel;