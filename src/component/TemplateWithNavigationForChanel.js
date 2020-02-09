import React from 'react';
import Navigation from './Navigation';
import TabPanel from './TabPanelForChatServer';
import Chanels from '../chats/Chanels';

class TemplateWithNavigationForChanel extends React.Component {

    render() {
        return (
            <>
                <div id="wrap-left">
                    <Navigation />
                    <TabPanel display={this.props.tabPenel || "block"}>
                        <Chanels />
                    </TabPanel>
                </div>
                <div id="wrap-right" style={{width: this.props.widthRight}}>
                    <div className="container tab-content" id="nav-tabContent">
                        {this.props.children}
                    </div>
                </div>
            </>
        )
    }
}

export default TemplateWithNavigationForChanel;