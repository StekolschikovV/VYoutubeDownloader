export enum DataType {
  error = 'error',
  video = 'video',
  playlist = 'playlist',
  channel = 'channel'
}

export enum MessageType {
  setProgressBarMessage = 'set-progress-bar-message',
  setPathMessage = 'set-path-message',
  getInfoMessage = 'get-info-message',
  clearInfoMessage = 'clear-info-message',
  stopDownloadMessage = 'stop-download-message',
  stopSearchMessage = 'stop-search-message',
  clearDownloadMessage = 'clear-download-message',
  getInfoListImmediatelyReply = 'get-info-list-immediately-reply',
  getInfoListImmediatelyMessage = 'get-info-list-immediately-message',
  downloadMessage = 'download-message',
  getDownloadListImmediatelyReply = 'get-download-list-immediately-reply',
  getDownloadListImmediatelyMessage = 'get-download-list-immediately-message',
  getDefaultPathMessage = 'get-default-path-message',
  getDefaultPathReply = 'get-default-path-reply'
}


export class Formats {
  format: string;
  format_note: string;
  format_id: string;
  filesize: number;
  ext: string;
  height: number;
  url: string;
  constructor(
    format: string,
    format_note: string,
    format_id: string,
    filesize: number,
    ext: string,
    height: number,
    url: string,
  ) {
    this.format = format;
    this.format_note = format_note;
    this.format_id = format_id;
    this.filesize = filesize;
    this.ext = ext;
    this.height = height;
    this.url = url;
  }
}


export interface PlayListI {
  id: string;
  youtubeUrl: string;
  title: string;
  thumbnail: string;
  duration: string;
}

export interface DownloaderI {
  isLoadNow: boolean;
  path: string;

  videoInfoList: VideoInfo[];

  clear(): void;

  stop(): void;

  setPath(path: string): void;

  getListImmediately();

  download(videoInfo: VideoInfo[]): Promise<VideoInfo[]>;

  _doDownload(videoInfo: VideoInfo): void;
}

export class VideoInfo {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  isLoaded = false;
  isStartLoaded = false;
  isSelected = false;
  selectedFormat: Formats;
  formats: Formats[];
  channelUrl: string;
  constructor(
    url?: string,
    title?: string,
    description?: string,
    thumbnail?: string,
    duration?: string,
  ) {
    this.url = url;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.thumbnail = thumbnail;
  }
}

export class InfoResponse {
  valid: boolean;
  error: null;
  video: VideoInfo[];
}

export class GetInfoListImmediately {
  videoInfoList: VideoInfo[];
  videoUrlList: string[];
  isLoadNow: boolean;
}

export class GetDownloadListImmediately {
  videoInfo: VideoInfo[];
  isLoadNow: boolean;
}

export interface InfoI {
  isLoadNow: boolean;

  videoInfoList: VideoInfo[];

  stop();

  clear(): void;

  getDefaultPath(): string;

  getInfoListImmediately(): GetInfoListImmediately;

  _isValidUrl(url: string): boolean;

  _getType(url: string): DataType;

  _getInfo(url: string);

  get(url: string): Promise<InfoResponse>;
}

export interface BackEndI {

  browserWindow;

  setBrowserWindow(win): void;

  stopDownload(): void;

  stopSearch(): void;

  clearInfo(): void;

  clearDownload(): void;

  getInfo(): void;

  getInfoListImmediately(): void;

  getDownloadListImmediately(): void;

  download(): void;

  setPath(path: string): void;

  setProgressBar(): void;
}
