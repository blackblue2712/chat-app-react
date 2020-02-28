import React from 'react';
import Navigation from './Navigation';
import TabPanel from './TabPanel';
import Discussion from './Discussion';
import CreateChanel from './CreateChanel';

class TemplateWithNavigation extends React.Component {

    render() {
        return (
            <>
                <CreateChanel />
                <div id="wrap-left">
                    <Navigation />
                    <TabPanel display={this.props.tabPenel || "block"} >
                        <Discussion />
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

export default TemplateWithNavigation;