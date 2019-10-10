import {DownloaderI, VideoInfo, GetDownloadListImmediately} from './dataType';
const request = require('request');
const youtubedl = require('youtube-dl');
import * as path from 'path';

const fs = require('fs');

export class Downloader implements DownloaderI {
  isLoadNow = false;
  videoInfoList: VideoInfo[] = [];
  path = '';

  clear(): void {
    this.videoInfoList = [];
  }

  async _doDownload(videoInfo: VideoInfo) {
    console.log('aaaaasdad');
    return new Promise((resolve, reject) => {
      // try {
        // const video = youtubedl(videoInfo.url, ['--format=18']);
        console.log('!!!', videoInfo.selectedFormat.format);
        if (videoInfo.selectedFormat.format.includes('audio')) {
          console.log(videoInfo.selectedFormat.format);
          console.log(videoInfo.selectedFormat.url);
          request
            .get(videoInfo.selectedFormat.url)
            .on('error', function(err) {
              reject(err);
            })
            .on('end', function(err) {
              resolve('ok');
            })
            .pipe(fs.createWriteStream(path.join(this.path, videoInfo.title + '.' + videoInfo.selectedFormat.ext)));

          // youtubedl.exec(videoInfo.selectedFormat.url, ['-x', '--audio-format', 'mp3'], {}, function (err, output) {
          //   if (err) {
          //     // console.log('------------------>', err);
          //     reject(err);
          //   } else  {
          //     videoInfo.isLoaded = true;
          //
          //
          //     resolve('ok');
          //
          //
          //   }
          //   console.log('------------------>', output);
          // });
        } else {
          console.log('!!!@!#@#')
          const video = youtubedl(videoInfo.url, [`--format=${videoInfo.selectedFormat.format_id}`]);
          const output = path.join(this.path, videoInfo.title + '.' + videoInfo.selectedFormat.ext);
          video.pipe(fs.createWriteStream(output));
          video.on('end', () => {
            videoInfo.isLoaded = true;
            resolve('ok');
          });
        }

      // } catch (error) {
      //   reject(error);
      // }
    });
  }

  setPath(pathStr: string): void {
    this.path = pathStr;
  }

  async processArray(): Promise<string> {
    for (const videoInfo of this.videoInfoList) {
      console.log('oooo');
      if (!videoInfo.isLoaded && this.isLoadNow) {
        console.log('aaaa');
        await this._doDownload(videoInfo)
          .then(
            (info) => {
              console.log('nnnnn');
              videoInfo.isLoaded = true;
            },
            (error) => {
              videoInfo.isLoaded = true;
            }
          );
      }
    }
    return 'ok';
  }

  getListImmediately(): GetDownloadListImmediately {
    // console.log('---> getListImmediately()')
    return {
      videoInfo: this.videoInfoList,
      isLoadNow: this.isLoadNow
    };
  }

  stop(): void {
    this.clear();
    this.isLoadNow = false;
  }

  async download(videoInfo: VideoInfo[] = []): Promise<VideoInfo[]> {
    this.isLoadNow = true;
    videoInfo.forEach((e) => {
      let isUnique = true;
      this.videoInfoList.forEach((et) => {
        if (e.url === et.url && this.isLoadNow) {
          isUnique = false;
        }
      });
      if (isUnique && this.isLoadNow) {
        this.videoInfoList.push(e);
      }
    });
    if (this.isLoadNow) {
      console.log('pppp');
      await this.processArray();
    }

    this.isLoadNow = false;
    return this.videoInfoList;
  }


}
