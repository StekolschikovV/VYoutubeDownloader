import {Injectable} from '@angular/core';
import {ipcMain, ipcRenderer} from 'electron';
import {MessageType, GetInfoListImmediately, VideoInfo, GetDownloadListImmediately} from '../../../dataType';
import {BehaviorSubject} from 'rxjs';
import {count} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  isOnline = new BehaviorSubject<boolean>(true);
  video = new BehaviorSubject<VideoInfo[]>([]);
  videoShadow = new BehaviorSubject<string[]>([]);
  isInfoLoadNow = new BehaviorSubject<boolean>(false);
  isDownloadLoadNow = new BehaviorSubject<boolean>(false);
  path = new BehaviorSubject<string>('');
  selectedCount = new BehaviorSubject<number>(0);
  progressBar = new BehaviorSubject<number>(-2);

  constructor() {
    this.getDefaultPath();
    this.clearInfo();
    this.downloaderSetPath();
    this.checkInternet();
    this.selectedCounter();
  }

  setProgressBar(progress: number) {
    // console.log('--->setProgressBar', progress);
    ipcRenderer.send(MessageType.setProgressBarMessage, progress);
  }

  selectedCounter() {
    this.video.subscribe((eList) => {
      let _selectedCount = 0;
      eList.forEach((e) => {
        if (e.isSelected) {
          _selectedCount++;
        }
      });
      this.selectedCount.next(_selectedCount);
    });
  }

  checkInternet() {
    this.isOnline.next(navigator.onLine ? true : false);
    window.addEventListener('online', () => {
      this.isOnline.next(true);
    });
    window.addEventListener('offline', () => {
      this.isOnline.next(false);
    });
  }

  downloaderSetPath() {
    this.path.subscribe((path) => {
      ipcRenderer.send(MessageType.setPathMessage, path);
    });
  }

  downloadSelected() {
    const selectedList = [];
    const newVideoList = [];
    this.video.getValue().forEach((e) => {
      if (e.isSelected) {
        selectedList.push(e);
        const tempEl = e;
        e.isStartLoaded = true;
        newVideoList.push(tempEl);
      } else {
        newVideoList.push(e);
      }
    });
    this.video.next(newVideoList);
    ipcRenderer.send(MessageType.downloadMessage, selectedList);
    this.isDownloadLoadNow.next(true);
    this.listenDownload();
  }

  listenDownload() {
    const timer = setInterval(() => {
      ipcRenderer.send(MessageType.getDownloadListImmediatelyMessage);
    }, 1000);
    ipcRenderer.on(MessageType.getDownloadListImmediatelyReply, (event, res: GetDownloadListImmediately) => {
      const downloadedList = [];
      // console.log(res)


      this.video.getValue().forEach((e) => {
        let needUpdate = false;
        res.videoInfo.forEach((et) => {
          if (et.url === e.url && et.isLoaded !== e.isLoaded) {
            needUpdate = true;
          }
        });
        if (needUpdate) {
          const tempE = e;
          tempE.isLoaded = true;
          downloadedList.push(tempE);
        } else {
          downloadedList.push(e);
        }
      });
      this.video.next(downloadedList);
      // Progress
      const notLoadingVideoCount = this.getNotLoadingVideoCount();
      const proc = ((notLoadingVideoCount * 100) / res.videoInfo.length) / 100;
      this.setProgressBar(proc);
      if (!res.isLoadNow) {
        clearInterval(timer);
        this.clearDownload();
        this.isDownloadLoadNow.next(false);
        this.setProgressBar(-2);
      }
    });
  }

  getNotLoadingVideoCount() {
    let countFalse = 0;
    this.video.value.forEach((e) => {
      if (e.isLoaded === true) {
        countFalse++;
      }
    });
    return countFalse;
  }

  selectVideo(videoInfo: VideoInfo) {
    const _video = [];
    this.video.getValue().forEach((e) => {
      if (e.url === videoInfo.url) {
        e.isSelected = !e.isSelected;
      }
      _video.push(e);
    });
    this.video.next(_video);
  }

  clearDownload() {
    ipcRenderer.send(MessageType.clearDownloadMessage);
  }

  clearInfo() {
    ipcRenderer.send(MessageType.clearInfoMessage);
  }

  getDefaultPath() {
    ipcRenderer.send(MessageType.getDefaultPathMessage);
    ipcRenderer.on(MessageType.getDefaultPathReply, (event, res: string) => {
      this.path.next(res);
    });
  }

  getInfo(url: string) {
    if (url !== undefined) {
      this.isInfoLoadNow.next(true);
      console.log(url);
      ipcRenderer.send(MessageType.getInfoMessage, url);
      this.listenInfo();
    }

  }

  listenInfo() {
    const timer = setInterval(() => {
      ipcRenderer.send(MessageType.getInfoListImmediatelyMessage);
    }, 1000);
    ipcRenderer.on(MessageType.getInfoListImmediatelyReply, (event, res: GetInfoListImmediately) => {
      res.videoInfoList.forEach((e: VideoInfo) => {
        // console.log(e.formats);
        this.addVideoInfo(e);
      });

      this.addVideoInfoShadow(res.videoUrlList);
      if (!res.isLoadNow) {
        this.isInfoLoadNow.next(false);
        this.videoShadow.next([]);
        clearInterval(timer);
        this.clearInfo();
      }
    });
  }

  addVideoInfoShadow(shadowUrl: string[]) {
    const newShadows = [];
    shadowUrl.forEach((shadowUrlEl) => {
      let isUnique = true;
      this.video.getValue().forEach((e) => {
        if (shadowUrlEl === e.url) {
          isUnique = false;
        }
      });
      if (isUnique) {
        newShadows.push(shadowUrlEl);
      }
    });
    this.videoShadow.next(newShadows);
  }

  addVideoInfo(videoInfo: VideoInfo) {
    let isUnique = true;
    this.video.getValue().forEach((e) => {
      if (videoInfo.url === e.url) {
        isUnique = false;
      }
    });
    if (isUnique) {
      this.video.next(this.video.getValue().concat([videoInfo]));
    }
  }

  selectAll() {
    const newVideoArr = [];
    this.video.getValue().forEach((e) => {
      const temp = e;
      temp.isSelected = !temp.isSelected;
      newVideoArr.push(temp);
    });
    this.video.next(newVideoArr);
  }

  downloadStop() {
    ipcRenderer.send(MessageType.stopDownloadMessage);
    const newVideoList = [];
    this.video.getValue().forEach((e) => {
      const tempEl = e;
      tempEl.isStartLoaded = false;
      newVideoList.push(tempEl);
    });
    this.video.next(newVideoList);
    this.isDownloadLoadNow.next(false);
  }

  searchStop() {
    ipcRenderer.send(MessageType.stopSearchMessage);
    // this.videoShadow.next([]);
    this.clearInfo();
  }

  rmSelected() {
    const newVideoList = [];
    this.video.value.forEach((e) => {
      if (!e.isSelected) {
        newVideoList.push(e);
      }
    });
    this.video.next(newVideoList);
  }

  selectFormat(value: any, el: VideoInfo) {
    let selectedFormat;
    el.formats.forEach((eF) => {
      if (eF.format_id === value) {
        selectedFormat = eF;
      }
    });
    const newVideoList = [];
    this.video.value.forEach((e) => {
      if (e.url === el.url) {
        e.selectedFormat = selectedFormat;
      }
      newVideoList.push(e);
    });
    // console.log(newVideoList);
    this.video.next(newVideoList);
  }
}
