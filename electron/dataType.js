"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataType;
(function (DataType) {
    DataType["error"] = "error";
    DataType["video"] = "video";
    DataType["playlist"] = "playlist";
    DataType["channel"] = "channel";
})(DataType = exports.DataType || (exports.DataType = {}));
var MessageType;
(function (MessageType) {
    MessageType["setProgressBarMessage"] = "set-progress-bar-message";
    MessageType["setPathMessage"] = "set-path-message";
    MessageType["getInfoMessage"] = "get-info-message";
    MessageType["clearInfoMessage"] = "clear-info-message";
    MessageType["stopDownloadMessage"] = "stop-download-message";
    MessageType["stopSearchMessage"] = "stop-search-message";
    MessageType["clearDownloadMessage"] = "clear-download-message";
    MessageType["getInfoListImmediatelyReply"] = "get-info-list-immediately-reply";
    MessageType["getInfoListImmediatelyMessage"] = "get-info-list-immediately-message";
    MessageType["downloadMessage"] = "download-message";
    MessageType["getDownloadListImmediatelyReply"] = "get-download-list-immediately-reply";
    MessageType["getDownloadListImmediatelyMessage"] = "get-download-list-immediately-message";
    MessageType["getDefaultPathMessage"] = "get-default-path-message";
    MessageType["getDefaultPathReply"] = "get-default-path-reply";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var Formats = /** @class */ (function () {
    function Formats(format, format_note, format_id, filesize, ext, height, url) {
        this.format = format;
        this.format_note = format_note;
        this.format_id = format_id;
        this.filesize = filesize;
        this.ext = ext;
        this.height = height;
        this.url = url;
    }
    return Formats;
}());
exports.Formats = Formats;
var VideoInfo = /** @class */ (function () {
    function VideoInfo(url, title, description, thumbnail, duration) {
        this.isLoaded = false;
        this.isStartLoaded = false;
        this.isSelected = false;
        this.url = url;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.thumbnail = thumbnail;
    }
    return VideoInfo;
}());
exports.VideoInfo = VideoInfo;
var InfoResponse = /** @class */ (function () {
    function InfoResponse() {
    }
    return InfoResponse;
}());
exports.InfoResponse = InfoResponse;
var GetInfoListImmediately = /** @class */ (function () {
    function GetInfoListImmediately() {
    }
    return GetInfoListImmediately;
}());
exports.GetInfoListImmediately = GetInfoListImmediately;
var GetDownloadListImmediately = /** @class */ (function () {
    function GetDownloadListImmediately() {
    }
    return GetDownloadListImmediately;
}());
exports.GetDownloadListImmediately = GetDownloadListImmediately;
//# sourceMappingURL=dataType.js.map