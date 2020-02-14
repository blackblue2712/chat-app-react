import { searchYoutube } from '../controllers/ChanelController';
import YouTubePlayer from 'youtube-player';

class YoutubePlay {
    constructor(player, onPlayQueue = [], startSeconds = 0) {
        console.log("call YoutubePlay")
        this.onPlayQueue = onPlayQueue;
        this.onPlayQueueName = [];
        this.onPlaying = false;
        this.player = player;
        this.onPlayingSong = null;
        this.startSeconds = startSeconds;
        this.dataEvent = true;
    }

    searchYoutube(q) {
        searchYoutube(q)
            .then(res => {
                let vid = res.videoId;
                this.onPlayQueueName.push(res.title);
                this.playVideo(vid)
            })

    }

    playVideo(vid) {
        if (vid) {
            this.onPlayQueue.push(vid);
        }

        if (this.onPlaying === false) {
            this.onPlayingSong = this.onPlayQueue.shift();
            this.onPlayQueueName.shift();
            this.player.loadVideoById({
                videoId: this.onPlayingSong,
                startSeconds: this.startSeconds
            });
            this.player.playVideo();
            this.onPlaying = true;
        }


        this.player.on('stateChange', (event) => {
            if (event.data === 0) {
                if(this.dataEvent) {
                    this.dataEvent = false;
                    if (this.onPlayQueue.length > 0 && this.onPlaying) {
                        this.onPlayingSong = this.onPlayQueue.shift();
                        this.onPlayQueueName.shift();
                        this.player.loadVideoById(this.onPlayingSong);
                        this.player.playVideo().then( () => {
                            this.onPlaying = true;
                            this.dataEvent = true;
                        });
                    } else {
                        this.onPlaying = false;
                        this.dataEvent = true;
                    }
                }
            }
        });
        console.log(this.player);
    }
    
    getPlayQueue() {
        return this.onPlayQueue;
    }

    getIsPlaying() {
        return this.onPlaying;
    }

    getCurrentTime() {
        return this.player.getCurrentTime();
    }

    getCurrentSong() {
        return this.onPlayingSong;
    }

    getPlayQueueName() {
        return this.onPlayQueueName;
    }

    skipVideo() {
        console.log(this.onPlayQueue.length, this.onPlaying)
        if (this.onPlayQueue.length > 0 && this.onPlaying) {

            this.onPlayingSong = this.onPlayQueue.shift();
            this.onPlayQueueName.shift();
            this.player.loadVideoById(this.onPlayingSong);
            this.player.playVideo().then( () => {
                this.onPlaying = true;
                this.dataEvent = true;
            });
        } else {
            this.onPlaying = false;
            this.dataEvent = true;
        }
    }
}

export default YoutubePlay;
