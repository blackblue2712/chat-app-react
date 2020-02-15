import React from 'react';
import "./VideoCall.css";


function VideoCall({ status, callFrom, startCall, rejectCall }) {
    const acceptWithVideo = (video, screen) => {
        const config = { audio: true, video };
        return () => startCall(false, callFrom, config, screen);
    };
    return (
        <div className={`call ${status}`} id="call-response">
            <div className="content">
                <div className="container">
                    <div className="inside">
                        <div className="panel">
                            <div className="participant">
                                <img className="avatar-call" src="https://res.cloudinary.com/dged6fqkf/image/upload/v1581173169/jbwkupd6wxap1udmgfmz.png" alt="avatar" />
                                <span>Connecting to Sarah {callFrom}</span>
                                <div className="wave">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            </div>
                            <div className="options">
                                <button onClick={acceptWithVideo(false)} className="btn option"><i className="ti-microphone"></i></button>
                                <button onClick={acceptWithVideo(true)} className="btn option"><i className="ti-video-camera"></i></button>
                                <button onClick={acceptWithVideo(true, true)} className="btn option"><i className="ti-layout-media-left-alt"></i></button>
                                <button className="btn option"><i className="ti-volume"></i></button>
                                <button className="btn option"><i className="ti-comment"></i></button>
                            </div>
                            <button onClick={rejectCall} id="reject-call-video" className="btn option call-end"><i className="ti-close"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCall;