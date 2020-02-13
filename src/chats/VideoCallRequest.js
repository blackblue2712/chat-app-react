import React, { useState, useRef, useEffect } from 'react';
import "./VideoCall.css";


function VideoCall({ peerSrc, localSrc, config, mediaDevice, status, endCall }) {
    const peerVideo = useRef(null);
    const localVideo = useRef(null);
    const [video, setVideo] = useState(config.video);
    const [audio, setAudio] = useState(config.audio);

    useEffect(() => {
        if (peerVideo.current && peerSrc) {
            peerVideo.current.srcObject = peerSrc;
        }
        if (localVideo.current && localSrc) {
            localVideo.current.srcObject = localSrc;   
        }
    });

    useEffect(() => {
        if (mediaDevice) {
            mediaDevice.toggle('Video', video);
            mediaDevice.toggle('Audio', audio);
        }
    });

    /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
    const toggleMediaDevice = (deviceType) => {
        if (deviceType === 'video') {
        setVideo(!video);
        mediaDevice.toggle('Video');
        }
        if (deviceType === 'audio') {
        setAudio(!audio);
        mediaDevice.toggle('Audio');
        }
    };
    
    return (
        <div class={`call ${status}`} id="call-request">
            <video id="call-local-video" ref={localVideo} autoPlay></video>
            <video id="call-remote-video" ref={peerVideo} autoPlay></video>
            <div class="content">
                <div class="container">
                    <div class="inside">
                        <div class="panel">
                            <div class="participant">
                                {/* <img class="avatar-call" src="https://res.cloudinary.com/dged6fqkf/image/upload/v1581173169/jbwkupd6wxap1udmgfmz.png" alt="avatar" />
                                <span>Connecting to Sarah</span> */}
                                {/* <div class="wave">
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div> */}
                            </div>
                            <div class="options">
                                <button class="btn option"><i class="ti-microphone"></i></button>
                                <button class="btn option"><i class="ti-video-camera"></i></button>
                                <button class="btn option"><i class="ti-user">+</i></button>
                                <button class="btn option"><i class="ti-volume"></i></button>
                                <button class="btn option"><i class="ti-comment"></i></button>
                            </div>
                            <button onClick={() => endCall(true)} id="end-call-video" class="btn option call-end"><i class="ti-close"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCall;