import React from 'react';

class ItemMessage extends React.Component {

    render() {
        let { isMe, date, content } = this.props;

        return (
            <div className={`message ${isMe}`}>
                {!isMe && <img className="avatar-md" src="./imgs/753453.png" data-toggle="tooltip" data-placement="top" title alt="avatar" data-original-title="Karen joye" />}
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