import React from 'react';
import "./Discovery.css";
import IMG from '../imgs/layd.jpg';
import CardChanel from './CardChanel';
import IMGBG from '../imgs/rs-bg.png';

import Template from './TemplateWithNavigationForChanel';
import { getChanels, findDiscovery } from '../controllers/ChanelController';

class Discovery extends React.Component {
    constructor() {
        super();
        this.state = {
            chanels: []
        }
    }

    componentDidMount() {
        try {
            getChanels()
            .then( res => {
                if(!res.message) {
                    this.setState( {chanels: res} )
                }
            });
        } catch (e) { console.log(e) }
    }

    onSubmitFind = async event => {
        event.preventDefault();
        
        let textSearch = document.getElementById("search-chanels");
        const response = await findDiscovery(textSearch.value);
        console.log(response);
        this.setState({ chanels: response });


    }


    render() {
        let { chanels } = this.state;
        console.log(chanels)
        return (
            <Template widthRight="calc(100% - 81px)">
                <div id="guild-discovery">
                    <div className="page-header"></div>
                    <div className="page-body">
                        <h2>Find new communities on Liarschat</h2>
                        <div className="search">
                            <form onSubmit={this.onSubmitFind} name="search-chanels-form" id="search-chanels-form">
                                <input type="text" id="search-chanels" placeholder="Try searching for chanel you intersted" />
                                <button className="button button-link">
                                    <svg style={{ fill: '#2298ff' }} aria-hidden="true" className="svg-icon s-input-icon s-input-icon__search iconSearch" width={16} height={16} viewBox="0 0 18 18"><path d="M18 16.5l-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0z" /></svg>
                                </button>
                            </form>
                            <div className="select-search-box"></div>
                        </div>

                        <section>
                            <h3>Popular servers and communities</h3>
                            <div className="guild-list">
                                {
                                    chanels.map( (cn, i) => {
                                        return <CardChanel
                                            key={i}
                                            cid={cn._id}
                                            cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                            cardImg={cn.chanelPhoto.photoBackground}
                                            cardDescription={cn.chanelDescription}
                                            cardTitle={cn.chanelName}
                                            cardMemerCount="80,954"
                                        />
                                    })
                                }
                                <CardChanel
                                    cid="123"
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMGBG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                <CardChanel
                                    cardIcon="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64"
                                    cardImg={IMG}
                                    cardDescription="Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!"
                                    cardTitle="Destiny 2 PC LFG"
                                    cardMemerCount="80,954"
                                />
                                
                                <div class="guild-card">
                                    <div class="card-header">
                                        <div class="card-img">
                                        <svg width="256" height="144" viewBox="0 0 256 144">
                                    <foreignObject x="0" y="0" width="256" height="144" mask="url(#svg-mask-vertical-fade)">
                                        <img src="https://cdn.discordapp.com/discovery-splashes/302094807046684672/b3abc737a37bdff48d0d3237b65ac994.jpg?size=256" alt="" class="splashImage-1wJ3Sk" />
                                    </foreignObject>
                                </svg>
                                        </div>
                                        <div class="card-icon">
                                            <img class="card-icon" src="https://cdn.discordapp.com/icons/356833056562348042/a_64a991f335045c61466f008e85a6d95d.png?size=64" alt="icon" />
                                        </div>
                                    <div class="card-button"><button class="btn">Join</button></div></div><div class="guild-info"><div class="title"><span>Destiny 2 PC LFG</span></div><div class="description"><span>Active LFG Server + Community for Destiny 2 on PC Cross Saves WELCOME!</span></div><div class="member-info"><div class="member-count"><div class="dot-online"></div><strong>80,954</strong> Online</div></div></div></div>
                            </div>
                        </section>
                    </div>
                </div>
            </Template>
        )
    }
}

export default Discovery;