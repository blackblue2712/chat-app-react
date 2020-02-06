import React from 'react';

class ItemMessageAttachment extends React.Component {

    render() {
        let { isMe, date, filename, capacity } = this.props;

        return (
            <div className={`message ${isMe}`}>
                {!isMe && <img className="avatar-md" src="./imgs/753453.png" data-toggle="tooltip" data-placement="top" title alt="avatar" data-original-title="Karen joye" />}
                <div className="text-main">
                    <div className={`text-group ${isMe}`}>
                        <div className={`text ${isMe}`}>
                            <div className="attachment">
                                <button className="btn attach" title="Click to download"><i className="ti-file" /></button>
                                <div className="file">
                                    <h5><a href="#" title="Click to download">{filename}</a></h5>
                                    <span>{capacity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span>{date}</span>
                </div>
            </div>
        )
    }
}

export default ItemMessageAttachment;