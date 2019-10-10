const YoutubeGrabber = require('youtube-grabber-js');
const youtubedl = require('youtube-dl');
import {DataType, InfoI, InfoResponse, PlayListI, VideoInfo} from './dataType';

export class Info implements InfoI {

    isLoadNow: boolean = false;
    videoInfoList: VideoInfo[] = [];
    videoUrlList: string[] = [];

    _isValidUrl(url: string): boolean {
        return YoutubeGrabber.isYoutubeURLValid(url);
    }

    _getType(url: string): DataType {
        return YoutubeGrabber.getTypeOfResource(url);
    }

    getListImmediately() {
        return {
            videoInfoList: this.videoInfoList.length,
            videoUrlList: this.videoUrlList.length,
            isLoadNow: this.isLoadNow,
        }
    }

    async get(url: string): Promise<InfoResponse> {
        this.isLoadNow = true;
        // var
        const infoResponse = new InfoResponse();
        infoResponse.valid = this._isValidUrl(url);
        const type = this._getType(url);


        // video
        if (type == DataType.video) {

            try {
                this.videoUrlList.push(url)
            } catch (error) {
                infoResponse.error = error;
            }

        }
        // playlist
        else if (type == DataType.playlist) {
            const playlist = YoutubeGrabber.getPlaylistInfo(url);
            await playlist
                .then(
                    (res: any) => {
                        if (res.error.status) {
                            infoResponse.error = res.error.reason;
                        } else {
                            const playlistArr: PlayListI[] = res.info.videos.array;
                            playlistArr.forEach((e) => {
                                this.videoUrlList.push('https://www.youtube.com' + e.youtubeUrl)
                            });
                        }
                    }, error => {
                        infoResponse.error = error;
                    }
                )
        }
        // channel
        else if (type == DataType.channel) {
            const channel = YoutubeGrabber.getChannelInfo(url, {videos: true});
            await channel
                .then((res) => {
                        if (res.error.status) {
                            infoResponse.error = res.error.reason;
                        } else {
                            res.info.videos.forEach((e) => {
                                this.videoUrlList.push('https://www.youtube.com' + e.youtubeUrl);
                            });
                        }
                    }, error => {
                        infoResponse.error = error;
                    }
                )
        }
        // processArray
        infoResponse.video = await this.processArray(this.videoUrlList);
        this.isLoadNow = false;
        // return
        return infoResponse;
    }

    async processArray(videoUrlList): Promise<VideoInfo[]> {
        let res: VideoInfo[] = [];
        for (const videoUr of videoUrlList) {
            await this._getInfo(videoUr)
                .then((videoInfo) => {
                    res.push(videoInfo)
                })
        }
        return res;
    }

    async _getInfo(url: string): Promise<VideoInfo> {
        return new Promise((resolve, reject) => {
            youtubedl.getInfo(url, [], (err, res: any) => {
                if (err == null) {
                    let info = new VideoInfo();
                    info.title = res.title;
                    info.description = res.description;
                    info.duration = res._duration_hms;
                    info.url = url
                    this.videoInfoList.push(info);
                    resolve(info)
                } else {
                    reject(err);
                }
            });
        });
    }


}
