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
        <div className={`call ${status}`} id="call-request">
            <video id="call-local-video" ref={localVideo} autoPlay></video>
            <video id="call-remote-video" controls ref={peerVideo} autoPlay></video>
            <div className="content">
                <div className="container">
                    <div className="inside">
                        <div className="panel">
                            <div className="participant">
                                {/* <img className="avatar-call" src="https://res.cloudinary.com/dged6fqkf/image/upload/v1581173169/jbwkupd6wxap1udmgfmz.png" alt="avatar" />
                                <span>Connecting to Sarah</span> */}
                                {/* <div className="wave">
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div> */}
                            </div>
                            <div className="options">
                                <button onClick={() => toggleMediaDevice("audio")} className={`btn option ${audio}`}><i className="ti-microphone"></i></button>
                                <button onClick={() => toggleMediaDevice("video")} className={`btn option ${video}`}><i className="ti-video-camera"></i></button>
                                <button className="btn option"><i className="ti-user"></i></button>
                                <button className="btn option"><i className="ti-volume"></i></button>
                                <button className="btn option"><i className="ti-comment"></i></button>
                            </div>
                            <button onClick={() => endCall(true)} id="end-call-video" className="btn option call-end"><i className="ti-close"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCall;