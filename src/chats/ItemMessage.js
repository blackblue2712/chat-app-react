import React from 'react';

class ItemMessage extends React.Component {

    render() {
        let { isMe, date, content, photo } = this.props;

        return (
            <div className={`message ${isMe}`}>
                {!isMe && <img className="avatar-md" src={photo} data-toggle="tooltip" data-placement="top" alt="avatar" />}
                <div className="text-main">
                    <div className={`text-group ${isMe}`}>
                        <div className={`text ${isMe}`}>
                            <p>{content}</p>
                        </div>
                    </div>
                    <span>{date}</span>
                </div>
            </div>
        )
    }
}

export default ItemMessage;