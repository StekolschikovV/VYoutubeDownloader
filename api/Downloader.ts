import {DownloaderI, VideoInfo} from './dataType';
const youtubedl = require('youtube-dl');
import * as path from 'path';
const fs = require('fs');

export class Downloader implements DownloaderI {
    isLoadNow: boolean = false;
    videoInfoList: VideoInfo[] = [];
    path: string = '';

    async _doDownload(videoInfo: VideoInfo) {
        return new Promise((resolve, reject) => {
            try {
                const video = youtubedl(videoInfo.url, ['--format=18']);
                const output = path.join(this.path, videoInfo.title + '.mp4');
                video.pipe(fs.createWriteStream(output));
                video.on('end', () => {
                    videoInfo.isLoaded = true;
                    resolve('ok');
                });
            } catch (error) {
                reject(error);
            }

        })
    }

    setPath(path: string): void {
        this.path = path;
    }

    async processArray(): Promise<string> {
        for (const videoInfo of this.videoInfoList) {
            if (!videoInfo.isLoaded) {
                await this._doDownload(videoInfo)
                    .then(
                        (info) => {
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

    getListImmediately() {
        return {
            videoInfoList: this.videoInfoList,
            isLoadNow: this.isLoadNow
        }
    }

    async download(videoInfo: VideoInfo[]): Promise<VideoInfo[]> {
        this.isLoadNow = true;
        videoInfo.forEach((e) => {
            let isUnique = true;
            this.videoInfoList.forEach((et) => {
                if (e.url === et.url) {
                    isUnique = false;
                }
            });
            if (isUnique) {
                this.videoInfoList.push(e);
            }
        });
        await this.processArray();
        this.isLoadNow = false;
        return this.videoInfoList;
    }



}