const YoutubeGrabber = require('youtube-grabber-js');
const youtubeDl = require('youtube-dl');
import {DataType, InfoI, InfoResponse, PlayListI, VideoInfo, GetInfoListImmediately, Formats} from './dataType';

export class Info implements InfoI {

  isLoadNow = false;
  videoInfoList: VideoInfo[] = [];
  videoUrlList: string[] = [];
  errorCounter: 0;

  clear(): void {
    this.videoInfoList = [];
    this.videoUrlList = [];
  }

  _isValidUrl(url: string): boolean {
    return YoutubeGrabber.isYoutubeURLValid(url);
  }

  _getType(url: string): DataType {
    return YoutubeGrabber.getTypeOfResource(url);
  }

  async get(url: string): Promise<InfoResponse> {
    console.log('get', url)
    this.isLoadNow = true;
    // var
    const infoResponse = new InfoResponse();
    infoResponse.valid = this._isValidUrl(url);
    const type = this._getType(url);

    console.log('type', type)
    // video
    if (this.isLoadNow) {
      if (type === DataType.video) {
        this.videoUrlList.push(url);

      } else if (type === DataType.playlist) {
        await YoutubeGrabber.getPlaylistInfo(url)
          .then(
            (res: any) => {
              console.log('---1', res);
              if (res.error.status) {
                if (this.errorCounter < 4) {
                  this.get(url);
                } else {
                  infoResponse.error = res.error.reason;
                }
                this.errorCounter++;
              } else {
                this.errorCounter = 0;
                const playlistArr: PlayListI[] = res.info.videos.array;
                playlistArr.forEach((e) => {
                  this.videoUrlList.push('https://www.youtube.com' + e.youtubeUrl);
                });
              }
            }, error => {
              if (this.errorCounter < 4) {
                this.get(url);
              }
              this.errorCounter++;
              console.log('---2', error);
              // infoResponse.error = error;
            }
          );
      } else if (type === DataType.channel) {
        await YoutubeGrabber.getChannelInfo(url, {videos: true})
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
          );
      }
    }
    // processArray
    if (this.isLoadNow) {
      infoResponse.video = await this.processArray(this.videoUrlList);
    }
    setTimeout(() => {
      this.isLoadNow = false;
      // this.videoInfoList = [];
    }, 1000);
    // return
    // console.log('---> infoResponse', infoResponse)
    return infoResponse;
  }

  async processArray(videoUrlList): Promise<VideoInfo[]> {
    const res: VideoInfo[] = [];
    if (this.isLoadNow) {
      for (const videoUr of videoUrlList) {
        if (this.isLoadNow) {
          await this._getInfo(videoUr)
            .then(
              (videoInfo) => {
                res.push(videoInfo);
              },
              (error) => {
                // console.log('---> error 2');
              }
            );
        }
      }
    }
    return res;
  }

  async _getInfo(url: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      youtubeDl.getInfo(url, [], (err, res: any) => {
        if (err == null) {
          console.log(res);
          const formatList = [];
          res.formats.forEach((e: Formats) => {
            formatList.push(
              new Formats(
                e.format,
                e.format_note,
                e.format_id,
                e.filesize,
                e.ext,
                e.height,
                e.url
              )
            );
          });
          const info = new VideoInfo();
          info.channelUrl = res.channel_url;
          info.formats = formatList;
          info.title = res.title.split('/').join('').split('\\').join('');
          info.description = res.description;
          info.duration = res._duration_hms;
          info.url = url;
          info.selectedFormat = formatList[formatList.length - 1];
          info.thumbnail = res.thumbnail;
          this.videoInfoList.push(info);
          resolve(info);
        } else {
          reject(err);
        }
      });
    });
  }

  getInfoListImmediately(): GetInfoListImmediately {
    return {
      videoInfoList: this.videoInfoList,
      videoUrlList: this.videoUrlList,
      isLoadNow: this.isLoadNow,
    };
  }

  getDefaultPath(): string {
    return process.cwd();
  }

  constructor() {
  }

  stop() {
    this.isLoadNow = false;
  }

}
