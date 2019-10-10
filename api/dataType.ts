export enum DataType {
    error = 'error',
    video = 'video',
    playlist = 'playlist',
    channel = 'channel'
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

    setPath(path: string): void;

    videoInfoList: VideoInfo[];

    getListImmediately();

    download(videoInfo: VideoInfo[]): Promise<VideoInfo[]>;

    _doDownload(videoInfo: VideoInfo): void;
}

export class VideoInfo {
    url: string;
    title: string;
    description: string;
    duration: string;
    isLoaded: boolean = false;

    constructor(
        url?: string,
        title?: string,
        description?: string,
        duration?: string,
    ) {
        this.url = url;
        this.title = title;
        this.description = description;
        this.duration = duration;
    }
}

export class InfoResponse {
    valid: boolean;
    error: null;
    video: VideoInfo[];
}

export interface InfoI {
    isLoadNow: boolean;

    getListImmediately();

    videoInfoList: VideoInfo[];

    _isValidUrl(url: string): boolean;

    _getType(url: string): DataType;

    _getInfo(url: string);

    get(url: string): Promise<InfoResponse>;
}

