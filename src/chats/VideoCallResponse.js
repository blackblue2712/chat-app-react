import React from 'react';
import "./VideoCall.css";


function VideoCall({ status, callFrom, startCall, rejectCall }) {
    const acceptWithVideo = (video) => {
        const config = { audio: true, video };
        return () => startCall(false, callFrom, config);
    };
    return (
        <div class={`call ${status}`} id="call-response">
            <div class="content">
                <div class="container">
                    <div class="inside">
                        <div class="panel">
                            <div class="participant">
                                <img class="avatar-call" src="https://res.cloudinary.com/dged6fqkf/image/upload/v1581173169/jbwkupd6wxap1udmgfmz.png" alt="avatar" />
                                <span>Connecting to Sarah {callFrom}</span>
                                <div class="wave">
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div>
                            </div>
                            <div class="options">
                                <button class="btn option"><i class="ti-microphone"></i></button>
                                <button onClick={acceptWithVideo(true)} class="btn option"><i class="ti-video-camera"></i></button>
                                <button class="btn option"><i class="ti-user">+</i></button>
                                <button class="btn option"><i class="ti-volume"></i></button>
                                <button class="btn option"><i class="ti-comment"></i></button>
                            </div>
                            <button onClick={rejectCall} id="reject-call-video" class="btn option call-end"><i class="ti-close"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCall;