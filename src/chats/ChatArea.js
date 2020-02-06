import React from 'react';
import ItemMessage from '../chats/ItemMessage';
import ItemMessageAttachment from '../chats/ItemMessageAttachment';

class ChatArea extends React.Component {
    
    render() {
        return (
            <div id="chat-area">
              <div className="top">
                <div className="inside">
                  <div className="status online" />
                  <div className="data">
                    <h5><a href="#">Sarah Dalton</a></h5>
                    <span>Active now</span>
                  </div>
                  <button className="btn d-md-block d-none audio-call" title="Audio call">
                    <i className="ti-headphone-alt" />
                  </button>
                  <button className="btn d-md-block d-none audio-call" title="Audio call">
                    <i className="ti-video-camera" />
                  </button>
                  <button className="btn d-md-block d-none audio-call" title="Audio call">
                    <i className="ti-info" />
                  </button>
                </div>
              </div>
              <div className="content">
                <div className="container">
                  <div className="date">
                    <hr />
                    <span>Yesterday</span>
                    <hr />
                  </div>
                  <ItemMessage 
                    isMe=""
                    content="Where was i, i worry about my viewrs missing me too much!"
                    date="09:46 AM"
                  />
                  <ItemMessage 
                    isMe="me"
                    content="But if you are not available to talk, then would't they miss you more?"
                    date="11:32 AM"
                  />

                  <ItemMessage 
                    isMe=""
                    content="Aren't you sweet."
                    date="02:56 PM"
                  />

                  <ItemMessage 
                    isMe="me"
                    content="That's not an answer.."
                    date=""
                  />

                  <ItemMessage 
                    isMe="me"
                    content="I am tres sorry, what were you saying?"
                    date="10:21 PM"
                  />

                  <ItemMessage 
                    isMe=""
                    content="Great start guys, why can you only talk at certain time on certain days?"
                    date="11:07 PM"
                  />
                  <ItemMessage 
                    isMe="me"
                    content="hmmmm, Well done all. send me document please"
                    date="10:21 PM"
                  />
                 
                  <ItemMessageAttachment 
                    isMe=""
                    content="I am tres sorry, what were you saying?"
                    date="11:07 PM"
                    filename="Policy Sheet.pdf"
                    capacitty="80kb Document"
                  />

                  <ItemMessage 
                    isMe="me"
                    content="i have received the .pdf document please send me jpeg file for our requirement.."
                    date="10:21 PM"
                  />
                  
                  <div className="date">
                    <hr />
                    <span>Today</span>
                    <hr />
                  </div>

                </div>
                <div className="scroller" />
              </div>
              <div className="bottom">
                <form className="text-area">
                  <textarea className="form-control" placeholder="Start typing for reply..." rows={1} defaultValue={""} />
                  <div className="add-smiles">
                    <span title="add icon" className="em em-blush" />
                  </div>
                  <div className="smiles-bunch">
                    <i className="em em---1" />
                    <i className="em em-smiley" />
                    <i className="em em-anguished" />
                    <i className="em em-laughing" />
                    <i className="em em-angry" />
                    <i className="em em-astonished" />
                    <i className="em em-blush" />
                    <i className="em em-disappointed" />
                    <i className="em em-worried" />
                    <i className="em em-kissing_heart" />
                    <i className="em em-rage" />
                    <i className="em em-stuck_out_tongue" />
                    <i className="em em-expressionless" />
                    <i className="em em-bikini" />
                    <i className="em em-christmas_tree" />
                    <i className="em em-facepunch" />
                    <i className="em em-pushpin" />
                    <i className="em em-tada" />
                    <i className="em em-us" />
                    <i className="em em-rose" />
                  </div>
                  <button style={{ height: '56x' }} type="submit" className="btn send"><i className="ti-location-arrow" /></button>
                </form>
                <label>
                  <input type="file" className="d-none" />
                  <span className="btn attach"><i className="ti-clip" /></span>
                </label>
              </div>
            </div>
            // <div id="call-area">
            // </div>
        )
    }
}

export default ChatArea;