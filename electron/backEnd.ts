import {ipcMain, ipcRenderer} from 'electron';
import {BackEndI, GetInfoListImmediately, VideoInfo, MessageType} from './dataType';
import {Info} from './Info';
import {Downloader} from './Downloader';

const info = new Info();
const downloader = new Downloader();

export class BackEnd implements BackEndI {
  browserWindow: any;

  setBrowserWindow(win: any): void {
    this.browserWindow = win;
  }

  stopDownload(): void {
    ipcMain.on(MessageType.stopDownloadMessage, (event, url) => {
      downloader.stop();
    });
  }

  stopSearch(): void {
    ipcMain.on(MessageType.stopSearchMessage, (event, url) => {
      info.stop();
    });
  }


  getInfo(): void {
    console.log('!!!!1')
    ipcMain.on(MessageType.getInfoMessage, (event, url) => {
      console.log('!!!!2')
      info.get(url);
    });
  }

  getInfoListImmediately(): void {
    ipcMain.on(MessageType.getInfoListImmediatelyMessage, (event, url) => {
      event.reply(MessageType.getInfoListImmediatelyReply, info.getInfoListImmediately());
    });
  }

  download(): void {
    ipcMain.on(MessageType.downloadMessage, (event, videoInfo: VideoInfo[]) => {
      downloader.download(videoInfo);
    });
  }

  getDownloadListImmediately(): void {
    ipcMain.on(MessageType.getDownloadListImmediatelyMessage, (event, url) => {
      event.reply(MessageType.getDownloadListImmediatelyReply, downloader.getListImmediately());
    });
  }

  getDefaultPath() {
    ipcMain.on(MessageType.getDefaultPathMessage, (event, url) => {
      event.reply(MessageType.getDefaultPathReply, require('os').homedir());
    });
  }

  clearDownload(): void {
    ipcMain.on(MessageType.clearInfoMessage, (event, url) => {
      downloader.clear();
    });
  }

  clearInfo(): void {
    ipcMain.on(MessageType.clearInfoMessage, (event, url) => {
      info.clear();
    });
  }

  setPath(): void {
    ipcMain.on(MessageType.setPathMessage, (event, path) => {
      downloader.setPath(path);
    });
  }

  setProgressBar(): void {
    ipcMain.on(MessageType.setProgressBarMessage, (event, progress) => {
      // console.log('---> setProgressBarMessage', progress)
      try {
        this.browserWindow.setProgressBar(progress);
      } catch (e) {
        console.log(e);
      }
    });
  }

  constructor() {
    this.getInfo();
    this.getInfoListImmediately();
    this.download();
    this.getDownloadListImmediately();
    this.getDefaultPath();
    this.clearInfo();
    this.clearDownload();
    this.setPath();
    this.stopDownload();
    this.stopSearch();
    this.setProgressBar();
  }

}
